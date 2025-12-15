'use client';

import { useState, useEffect } from 'react';
import { useRouter } from '@/navigation'; // Use localized router
import Link from 'next/link';
import { motion } from 'framer-motion';
import { Plus, Clock, FileText, Search, MoreHorizontal, LogOut, User, Loader2 } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from 'sonner';
import { formatDistanceToNow } from 'date-fns';
import { LanguageSwitcher } from '@/components/LanguageSwitcher';
import { useTranslations } from 'next-intl';

interface Document {
  id: string;
  title: string;
  updated_at: string;
  created_at: string;
  owner_id: string;
  content?: {
    description?: string | null;
    imageUrl?: string | null;
    audioVoiceEnabled?: boolean;
    pageCount?: number;
    combinedContent?: string;
  } | null;
  profiles?: {
    full_name?: string;
    email?: string;
  };
}

export default function Home() {
  const { user, loading: authLoading, signOut } = useAuth();
  const router = useRouter();
  const [documents, setDocuments] = useState<Document[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');

  const t = useTranslations('Common');
  const tHome = useTranslations('Home');
  const tEditor = useTranslations('Editor');

  // Redirect to auth if not logged in
  useEffect(() => {
    if (!authLoading && !user) {
      router.push('/auth');
    }
  }, [user, authLoading, router]);

  // Load documents
  useEffect(() => {
    if (user) {
      loadDocuments();
    }
  }, [user]);

  const loadDocuments = async () => {
    if (!user || !supabase) return;

    try {
      setLoading(true);

      // Fetch documents where user is owner
      const { data: ownedDocs, error: ownedError } = await supabase
        .from('documents')
        .select('id, title, updated_at, created_at, owner_id, content')
        .eq('owner_id', user.id)
        .eq('is_archived', false)
        .order('updated_at', { ascending: false });

      if (ownedError) throw ownedError;

      // Fetch documents where user is a collaborator
      const { data: collabDocs, error: collabError } = await supabase
        .from('document_collaborators')
        .select('document_id')
        .eq('user_id', user.id);

      if (collabError) throw collabError;

      // Get document IDs from collaborators
      const collabDocIds = (collabDocs || []).map(c => c.document_id);

      // Fetch collaborated documents
      let collabDocuments: any[] = [];
      if (collabDocIds.length > 0) {
        const { data: collabDocsData, error: collabDocsError } = await supabase
          .from('documents')
          .select('id, title, updated_at, created_at, owner_id, content')
          .in('id', collabDocIds)
          .eq('is_archived', false)
          .order('updated_at', { ascending: false });

        if (collabDocsError) throw collabDocsError;
        collabDocuments = collabDocsData || [];
      }

      // Combine and deduplicate documents
      const allDocs: Document[] = [];
      const docIds = new Set<string>();

      // Add owned documents
      if (ownedDocs) {
        for (const doc of ownedDocs) {
          if (!docIds.has(doc.id)) {
            docIds.add(doc.id);
            // Fetch owner profile (handle errors gracefully)
            let profile = null;
            try {
              const { data: profileData, error: profileError } = await supabase
                .from('profiles')
                .select('full_name, email')
                .eq('id', doc.owner_id)
                .single();

              if (!profileError) {
                profile = profileData;
              }
            } catch (profileErr) {
              // Profile might not exist, that's okay
              console.warn('Profile not found for user:', doc.owner_id);
            }

            allDocs.push({
              ...doc,
              profiles: profile || undefined
            });
          }
        }
      }

      // Add collaborated documents
      for (const doc of collabDocuments) {
        if (!docIds.has(doc.id)) {
          docIds.add(doc.id);
          // Fetch owner profile (handle errors gracefully)
          let profile = null;
          try {
            const { data: profileData, error: profileError } = await supabase
              .from('profiles')
              .select('full_name, email')
              .eq('id', doc.owner_id)
              .single();

            if (!profileError) {
              profile = profileData;
            }
          } catch (profileErr) {
            // Profile might not exist, that's okay
            console.warn('Profile not found for user:', doc.owner_id);
          }

          allDocs.push({
            ...doc,
            profiles: profile || undefined
          });
        }
      }

      // Sort by updated_at
      allDocs.sort((a, b) =>
        new Date(b.updated_at).getTime() - new Date(a.updated_at).getTime()
      );

      setDocuments(allDocs);
    } catch (error: any) {
      console.error('Error loading documents:', error);

      // Extract meaningful error message
      let errorMessage = t('loadError');

      if (error?.message) {
        errorMessage = error.message;
      } else if (error?.error_description) {
        errorMessage = error.error_description;
      } else if (typeof error === 'string') {
        errorMessage = error;
      } else if (error?.code) {
        // Handle specific Supabase error codes
        if (error.code === 'PGRST116') {
          // No rows returned - this is okay, just means no documents yet
          console.log('No documents found (this is normal for new users)');
          setDocuments([]);
          return;
        } else if (error.code === '42P01') {
          errorMessage = 'Database tables not found. Please run the SQL migration in your Supabase dashboard.';
        } else if (error.code === 'PGRST301') {
          errorMessage = 'Permission denied. Please check your database permissions.';
        } else {
          errorMessage = `Database error (${error.code}): ${error.message || 'Unknown error'}`;
        }
      }

      // Only show error toast if it's a real error (not just "no documents")
      if (error?.code !== 'PGRST116') {
        toast.error(errorMessage);
      }
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteDocument = async (docId: string, e: React.MouseEvent) => {
    e.stopPropagation();

    if (!confirm(t('deleteConfirm'))) return;

    try {
      const { error } = await supabase
        .from('documents')
        .delete()
        .eq('id', docId)
        .eq('owner_id', user?.id);

      if (error) throw error;

      toast.success(t('deleteSuccess'));
      loadDocuments();
    } catch (error: any) {
      console.error('Error deleting document:', error);
      toast.error(t('deleteError'));
    }
  };

  const handleSignOut = async () => {
    await signOut();
    router.push('/auth');
  };

  const filteredDocuments = documents.filter(doc =>
    doc.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  if (authLoading || loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-indigo-600" />
      </div>
    );
  }

  if (!user) {
    return null; // Will redirect to auth
  }
  return (
    <main className="min-h-screen relative overflow-hidden">
      {/* Background Decor */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden -z-10 pointer-events-none">
        <div className="absolute top-[-20%] right-[-10%] w-[800px] h-[800px] bg-purple-200 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob"></div>
        <div className="absolute top-[-20%] left-[-10%] w-[800px] h-[800px] bg-indigo-200 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob animation-delay-2000"></div>
        <div className="absolute bottom-[-20%] left-[20%] w-[800px] h-[800px] bg-pink-200 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob animation-delay-4000"></div>
      </div>

      <div className="container mx-auto px-6 py-12">
        {/* Header */}
        <header className="flex justify-between items-center mb-16 animate-enter">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-xl flex items-center justify-center shadow-lg shadow-indigo-500/20">
              <FileText className="text-white w-6 h-6" />
            </div>
            <h1 className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-indigo-600 to-purple-600">
              {tHome('headerTitle')}
            </h1>
          </div>
          <div className="flex items-center space-x-4">
            <LanguageSwitcher />
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-slate-400" />
              <input
                type="text"
                placeholder={tHome('searchPlaceholder')}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 pr-4 py-2 w-64 rounded-full bg-white/50 backdrop-blur border border-white/60 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 transition shadow-sm"
              />
            </div>
            <div className="flex items-center gap-2 px-3 py-2 rounded-full bg-white/50 backdrop-blur border border-white/60">
              <User className="w-4 h-4 text-slate-600" />
              <span className="text-sm font-medium text-slate-700">
                {user.user_metadata?.full_name || user.email?.split('@')[0] || 'User'}
              </span>
            </div>
            <button
              onClick={handleSignOut}
              className="w-10 h-10 rounded-full bg-white/50 backdrop-blur border border-white/60 flex items-center justify-center hover:bg-white/80 transition shadow-sm"
              title={t('signOut')}
            >
              <LogOut className="w-5 h-5 text-slate-600" />
            </button>
          </div>
        </header>

        {/* Hero Section */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="mb-16 text-center"
        >
          <h2 className="text-5xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-slate-800 to-slate-600 mb-6 font-display">
            {tHome('heroTitle')}
          </h2>
          <p className="text-lg text-slate-500 mb-10 max-w-2xl mx-auto">
            {tHome('heroSubtitle')}
          </p>

          <Link href="/editor/new">
            <button className="group relative inline-flex items-center px-8 py-4 bg-gradient-to-r from-indigo-500 to-purple-600 text-white rounded-full font-medium shadow-xl shadow-indigo-500/25 hover:shadow-indigo-500/40 transform hover:-translate-y-1 transition-all duration-200 overflow-hidden">
              <span className="absolute inset-0 bg-white/20 group-hover:translate-x-full transition-transform duration-500 ease-out -skew-x-12 origin-left"></span>
              <Plus className="w-5 h-5 mr-2" />
              {tHome('createNew')}
            </button>
          </Link>
        </motion.section>

        {/* Documents List */}
        <section className="animate-enter-delay">
          <div className="flex items-center justify-between mb-8">
            <h3 className="text-xl font-semibold text-slate-800 flex items-center gap-2">
              <Clock className="w-5 h-5 text-slate-400" />
              {searchQuery ? `${t('searchResults')} (${filteredDocuments.length})` : `${t('myDocuments')} (${documents.length})`}
            </h3>
            {documents.length > 0 && (
              <button
                onClick={loadDocuments}
                className="text-sm text-indigo-600 font-medium hover:text-indigo-700"
              >
                {t('refresh')}
              </button>
            )}
          </div>

          {filteredDocuments.length === 0 && !loading ? (
            <div className="text-center py-16">
              <FileText className="w-16 h-16 text-slate-300 mx-auto mb-4" />
              <p className="text-slate-500 text-lg mb-2">
                {searchQuery ? t('noDocumentsFound') : t('noDocuments')}
              </p>
              <p className="text-slate-400 text-sm mb-6">
                {searchQuery ? t('searchPrompt') : t('startPrompt')}
              </p>
              {!searchQuery && (
                <Link href="/editor/new">
                  <button className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-indigo-500 to-purple-600 text-white rounded-full font-medium shadow-lg shadow-indigo-500/25 hover:shadow-indigo-500/40 transform hover:-translate-y-1 transition-all duration-200">
                    <Plus className="w-5 h-5 mr-2" />
                    {t('create')}
                  </button>
                </Link>
              )}
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredDocuments.map((doc, index) => (
                <Link key={doc.id} href={`/editor/${doc.id}`}>
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className="group glass-panel rounded-2xl p-0 overflow-hidden cursor-pointer hover:shadow-lg hover:border-indigo-200/50 transition-all duration-300"
                  >
                    {/* Image preview */}
                    {doc.content?.imageUrl ? (
                      <div className="h-40 w-full overflow-hidden">
                        <img
                          src={doc.content.imageUrl}
                          alt={doc.title || tEditor('untitled')}
                          className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                        />
                      </div>
                    ) : (
                      <div className="h-40 w-full bg-gradient-to-br from-indigo-100 via-purple-50 to-white flex items-center justify-center text-indigo-400">
                        <FileText className="w-10 h-10" />
                      </div>
                    )}

                    <div className="p-6">
                      <div className="flex justify-between items-start mb-3">
                        <div className="p-3 rounded-xl bg-indigo-100 text-indigo-600">
                          <FileText className="w-6 h-6" />
                        </div>
                        {doc.owner_id === user.id && (
                          <button
                            onClick={(e) => handleDeleteDocument(doc.id, e)}
                            className="p-2 hover:bg-red-100 rounded-full transition-colors opacity-0 group-hover:opacity-100 text-red-500"
                            title={t('delete')}
                          >
                            <MoreHorizontal className="w-5 h-5" />
                          </button>
                        )}
                      </div>

                      <h4 className="text-lg font-semibold text-slate-800 mb-1 group-hover:text-indigo-600 transition-colors line-clamp-2">
                        {doc.title || tEditor('untitled')}
                      </h4>
                      {doc.content?.description && (
                        <p className="text-sm text-slate-500 line-clamp-2 mb-2">
                          {doc.content.description}
                        </p>
                      )}
                      <p className="text-sm text-slate-500">
                        {formatDistanceToNow(new Date(doc.updated_at), { addSuffix: true })}
                      </p>
                      {doc.profiles && (
                        <p className="text-xs text-slate-400 mt-1">
                          by {doc.profiles.full_name || doc.profiles.email || 'Unknown'}
                        </p>
                      )}
                    </div>
                  </motion.div>
                </Link>
              ))}
            </div>
          )}
        </section>
      </div>
    </main>
  );
}
