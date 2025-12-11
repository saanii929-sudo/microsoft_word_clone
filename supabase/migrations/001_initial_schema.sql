-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Create profiles table (extends auth.users)
CREATE TABLE IF NOT EXISTS profiles (
    id UUID REFERENCES auth.users(id) PRIMARY KEY,
    full_name TEXT,
    email TEXT,
    avatar_url TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- Create documents table
CREATE TABLE IF NOT EXISTS documents (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    title TEXT NOT NULL DEFAULT 'Untitled Document',
    content JSONB, -- Store document metadata
    owner_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
    last_edited_by UUID REFERENCES auth.users(id),
    is_archived BOOLEAN DEFAULT FALSE,
    is_template BOOLEAN DEFAULT FALSE
);

-- Create pages table (for multi-page documents)
CREATE TABLE IF NOT EXISTS pages (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    document_id UUID REFERENCES documents(id) ON DELETE CASCADE NOT NULL,
    page_number INTEGER NOT NULL,
    content TEXT NOT NULL DEFAULT '',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
    UNIQUE(document_id, page_number)
);

-- Create document_collaborators table
CREATE TABLE IF NOT EXISTS document_collaborators (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    document_id UUID REFERENCES documents(id) ON DELETE CASCADE NOT NULL,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
    permission_level TEXT NOT NULL DEFAULT 'view', -- 'view', 'comment', 'edit', 'owner'
    invited_by UUID REFERENCES auth.users(id),
    invited_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
    UNIQUE(document_id, user_id)
);

-- Create document_versions table (for version history)
CREATE TABLE IF NOT EXISTS document_versions (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    document_id UUID REFERENCES documents(id) ON DELETE CASCADE NOT NULL,
    version_number INTEGER NOT NULL,
    content JSONB NOT NULL,
    created_by UUID REFERENCES auth.users(id),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
    UNIQUE(document_id, version_number)
);

-- Create active_users table (for real-time collaboration)
CREATE TABLE IF NOT EXISTS active_users (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    document_id UUID REFERENCES documents(id) ON DELETE CASCADE NOT NULL,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
    cursor_position JSONB,
    last_seen TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
    UNIQUE(document_id, user_id)
);

-- Enable Row Level Security (RLS)
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE documents ENABLE ROW LEVEL SECURITY;
ALTER TABLE pages ENABLE ROW LEVEL SECURITY;
ALTER TABLE document_collaborators ENABLE ROW LEVEL SECURITY;
ALTER TABLE document_versions ENABLE ROW LEVEL SECURITY;
ALTER TABLE active_users ENABLE ROW LEVEL SECURITY;

-- Profiles policies
CREATE POLICY "Users can view their own profile"
    ON profiles FOR SELECT
    USING (auth.uid() = id);

CREATE POLICY "Users can update their own profile"
    ON profiles FOR UPDATE
    USING (auth.uid() = id);

CREATE POLICY "Users can insert their own profile"
    ON profiles FOR INSERT
    WITH CHECK (auth.uid() = id);

-- Documents policies
CREATE POLICY "Users can view documents they own or collaborate on"
    ON documents FOR SELECT
    USING (
        owner_id = auth.uid() OR
        EXISTS (
            SELECT 1 FROM document_collaborators
            WHERE document_collaborators.document_id = documents.id
            AND document_collaborators.user_id = auth.uid()
        )
    );

CREATE POLICY "Users can create documents"
    ON documents FOR INSERT
    WITH CHECK (auth.uid() = owner_id);

CREATE POLICY "Users can update documents they own or have edit permission"
    ON documents FOR UPDATE
    USING (
        owner_id = auth.uid() OR
        EXISTS (
            SELECT 1 FROM document_collaborators
            WHERE document_collaborators.document_id = documents.id
            AND document_collaborators.user_id = auth.uid()
            AND document_collaborators.permission_level IN ('edit', 'owner')
        )
    );

CREATE POLICY "Users can delete documents they own"
    ON documents FOR DELETE
    USING (owner_id = auth.uid());

-- Pages policies
CREATE POLICY "Users can view pages of documents they have access to"
    ON pages FOR SELECT
    USING (
        EXISTS (
            SELECT 1 FROM documents
            WHERE documents.id = pages.document_id
            AND (
                documents.owner_id = auth.uid() OR
                EXISTS (
                    SELECT 1 FROM document_collaborators
                    WHERE document_collaborators.document_id = documents.id
                    AND document_collaborators.user_id = auth.uid()
                )
            )
        )
    );

CREATE POLICY "Users can insert pages for documents they can edit"
    ON pages FOR INSERT
    WITH CHECK (
        EXISTS (
            SELECT 1 FROM documents
            WHERE documents.id = pages.document_id
            AND (
                documents.owner_id = auth.uid() OR
                EXISTS (
                    SELECT 1 FROM document_collaborators
                    WHERE document_collaborators.document_id = documents.id
                    AND document_collaborators.user_id = auth.uid()
                    AND document_collaborators.permission_level IN ('edit', 'owner')
                )
            )
        )
    );

CREATE POLICY "Users can update pages of documents they can edit"
    ON pages FOR UPDATE
    USING (
        EXISTS (
            SELECT 1 FROM documents
            WHERE documents.id = pages.document_id
            AND (
                documents.owner_id = auth.uid() OR
                EXISTS (
                    SELECT 1 FROM document_collaborators
                    WHERE document_collaborators.document_id = documents.id
                    AND document_collaborators.user_id = auth.uid()
                    AND document_collaborators.permission_level IN ('edit', 'owner')
                )
            )
        )
    );

CREATE POLICY "Users can delete pages of documents they can edit"
    ON pages FOR DELETE
    USING (
        EXISTS (
            SELECT 1 FROM documents
            WHERE documents.id = pages.document_id
            AND (
                documents.owner_id = auth.uid() OR
                EXISTS (
                    SELECT 1 FROM document_collaborators
                    WHERE document_collaborators.document_id = documents.id
                    AND document_collaborators.user_id = auth.uid()
                    AND document_collaborators.permission_level IN ('edit', 'owner')
                )
            )
        )
    );

-- Document collaborators policies
CREATE POLICY "Users can view collaborators of documents they have access to"
    ON document_collaborators FOR SELECT
    USING (
        EXISTS (
            SELECT 1 FROM documents
            WHERE documents.id = document_collaborators.document_id
            AND (
                documents.owner_id = auth.uid() OR
                document_collaborators.user_id = auth.uid()
            )
        )
    );

CREATE POLICY "Document owners can add collaborators"
    ON document_collaborators FOR INSERT
    WITH CHECK (
        EXISTS (
            SELECT 1 FROM documents
            WHERE documents.id = document_collaborators.document_id
            AND documents.owner_id = auth.uid()
        )
    );

CREATE POLICY "Document owners can update collaborators"
    ON document_collaborators FOR UPDATE
    USING (
        EXISTS (
            SELECT 1 FROM documents
            WHERE documents.id = document_collaborators.document_id
            AND documents.owner_id = auth.uid()
        )
    );

CREATE POLICY "Document owners and collaborators can remove themselves"
    ON document_collaborators FOR DELETE
    USING (
        EXISTS (
            SELECT 1 FROM documents
            WHERE documents.id = document_collaborators.document_id
            AND (
                documents.owner_id = auth.uid() OR
                document_collaborators.user_id = auth.uid()
            )
        )
    );

-- Active users policies
CREATE POLICY "Users can view active users of documents they have access to"
    ON active_users FOR SELECT
    USING (
        EXISTS (
            SELECT 1 FROM documents
            WHERE documents.id = active_users.document_id
            AND (
                documents.owner_id = auth.uid() OR
                EXISTS (
                    SELECT 1 FROM document_collaborators
                    WHERE document_collaborators.document_id = documents.id
                    AND document_collaborators.user_id = auth.uid()
                )
            )
        )
    );

CREATE POLICY "Users can insert themselves as active users"
    ON active_users FOR INSERT
    WITH CHECK (
        auth.uid() = user_id AND
        EXISTS (
            SELECT 1 FROM documents
            WHERE documents.id = active_users.document_id
            AND (
                documents.owner_id = auth.uid() OR
                EXISTS (
                    SELECT 1 FROM document_collaborators
                    WHERE document_collaborators.document_id = documents.id
                    AND document_collaborators.user_id = auth.uid()
                )
            )
        )
    );

CREATE POLICY "Users can update their own active user record"
    ON active_users FOR UPDATE
    USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own active user record"
    ON active_users FOR DELETE
    USING (auth.uid() = user_id);

-- Function to automatically create profile on user signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
    INSERT INTO public.profiles (id, full_name, email)
    VALUES (
        NEW.id,
        COALESCE(NEW.raw_user_meta_data->>'full_name', ''),
        NEW.email
    );
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger to create profile on user signup
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
    AFTER INSERT ON auth.users
    FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = TIMEZONE('utc'::text, NOW());
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Triggers to update updated_at
CREATE TRIGGER update_profiles_updated_at
    BEFORE UPDATE ON profiles
    FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_documents_updated_at
    BEFORE UPDATE ON documents
    FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_pages_updated_at
    BEFORE UPDATE ON pages
    FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- Indexes for better performance
CREATE INDEX IF NOT EXISTS idx_documents_owner_id ON documents(owner_id);
CREATE INDEX IF NOT EXISTS idx_documents_updated_at ON documents(updated_at DESC);
CREATE INDEX IF NOT EXISTS idx_pages_document_id ON pages(document_id);
CREATE INDEX IF NOT EXISTS idx_pages_document_page ON pages(document_id, page_number);
CREATE INDEX IF NOT EXISTS idx_collaborators_document_id ON document_collaborators(document_id);
CREATE INDEX IF NOT EXISTS idx_collaborators_user_id ON document_collaborators(user_id);
CREATE INDEX IF NOT EXISTS idx_active_users_document_id ON active_users(document_id);
CREATE INDEX IF NOT EXISTS idx_active_users_last_seen ON active_users(last_seen);

