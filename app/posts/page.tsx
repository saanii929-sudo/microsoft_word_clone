"use client";

import { useEffect, useState } from 'react';

type Post = {
    userId: number;
    id: number;
    title: string;
    body: string;
};

export default function Post() {
    const [post, setPost] = useState<Post | null>(null);

    useEffect(() => {
        fetch('https://jsonplaceholder.typicode.com/posts/1')
        .then(res => res.json())
        .then((data: Post) => setPost(data));
    }, []);

    if (!post) return <p>Loading...</p>;

    return (
        <div>
            <h1>{post.title}</h1>
            <p>{post.body}</p>
        </div>
    );
}