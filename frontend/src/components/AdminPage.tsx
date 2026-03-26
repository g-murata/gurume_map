import React, { useState, useEffect } from 'react';
import { auth } from '../firebase';
import { fetchTags, createTag, updateTag, deleteTag } from '../apis/tags';
import { fetchAreas, createArea, updateArea, deleteArea } from '../apis/areas';
import { Tag, Area } from '../types';
import Loading from './Loading';

const ADMIN_EMAIL = process.env.REACT_APP_ADMIN_EMAIL as string;

console.log(process.env.REACT_APP_ADMIN_EMAIL)
const ManagerRow = (
  { item, onUpdate, onDelete }:
  { item: { id: number, name: string }, onUpdate: (id: number, name: string) => Promise<void>, onDelete: (id: number) => Promise<void> }
) => {
    const [isEditing, setIsEditing] = useState(false);
    const [name, setName] = useState(item.name);

    const handleUpdate = async () => {
        await onUpdate(item.id, name);
        setIsEditing(false);
    };

    return (
        <div className="flex items-center justify-between p-3 border-b hover:bg-gray-50 transition-colors">
            {isEditing ? (
                <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="border rounded-md px-2 py-1 text-sm w-full"
                />
            ) : (
                <span className="text-sm text-gray-700">{item.name}</span>
            )}
            <div className="flex items-center flex-shrink-0 ml-4">
                {isEditing ? (
                    <>
                      <button onClick={handleUpdate} className="text-sm font-semibold text-primary-600 hover:text-primary-700">保存</button>
                      <button onClick={() => setIsEditing(false)} className="ml-2 text-sm text-gray-500 hover:text-gray-700">キャンセル</button>
                    </>
                ) : (
                    <>
                      <button onClick={() => setIsEditing(true)} className="text-sm font-semibold text-blue-600 hover:text-blue-700">編集</button>
                      <button onClick={() => onDelete(item.id)} className="ml-2 text-sm font-semibold text-red-600 hover:text-red-700">削除</button>
                    </>
                )}
            </div>
        </div>
    );
};

export const AdminPage: React.FC = () => {
    const user = auth.currentUser;
    const [tags, setTags] = useState<Tag[]>([]);
    const [areas, setAreas] = useState<Area[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');
    const [newTagName, setNewTagName] = useState('');
    const [newAreaName, setNewAreaName] = useState('');

    useEffect(() => {
        if (user?.email === ADMIN_EMAIL) {
            setIsLoading(true);
            Promise.all([
                fetchTags().then(data => setTags(data.tags)),
                fetchAreas().then(data => setAreas(data.areas))
            ]).catch(() => {
                setError('データの読み込みに失敗しました。');
            }).finally(() => {
                setIsLoading(false);
            });
        }
    }, [user]);

    const handleAddTag = async () => {
        if (!newTagName.trim()) return;
        setIsLoading(true);
        try {
            const newTag = await createTag({ name: newTagName });
            setTags([...tags, newTag]);
            setNewTagName('');
        } catch (err) {
            setError('タグの追加に失敗しました。');
        } finally {
            setIsLoading(false);
        }
    };

    const handleUpdateTag = async (id: number, name: string) => {
        setIsLoading(true);
        try {
            const updatedTag = await updateTag(id, { name });
            setTags(tags.map(t => t.id === id ? { ...t, ...updatedTag } : t));
        } catch (err) {
            setError('タグの更新に失敗しました。');
        } finally {
            setIsLoading(false);
        }
    };

    const handleDeleteTag = async (id: number) => {
        if (!window.confirm('本当にこのタグを削除しますか？')) return;
        setIsLoading(true);
        try {
            await deleteTag(id);
            setTags(tags.filter(t => t.id !== id));
        } catch (err) {
            setError('タグの削除に失敗しました。');
        } finally {
            setIsLoading(false);
        }
    };

    const handleAddArea = async () => {
        if (!newAreaName.trim()) return;
        setIsLoading(true);
        try {
            const newArea = await createArea({ name: newAreaName });
            setAreas([...areas, newArea]);
            setNewAreaName('');
        } catch (err) {
            setError('エリアの追加に失敗しました。');
        } finally {
            setIsLoading(false);
        }
    };

    const handleUpdateArea = async (id: number, name: string) => {
        setIsLoading(true);
        try {
            const updatedArea = await updateArea(id, { name });
            setAreas(areas.map(a => a.id === id ? { ...a, ...updatedArea } : a));
        } catch (err) {
            setError('エリアの更新に失敗しました。');
        } finally {
            setIsLoading(false);
        }
    };

    const handleDeleteArea = async (id: number) => {
        if (!window.confirm('本当にこのエリアを削除しますか？')) return;
        setIsLoading(true);
        try {
            await deleteArea(id);
            setAreas(areas.filter(a => a.id !== id));
        } catch (err) {
            setError('エリアの削除に失敗しました。');
        } finally {
            setIsLoading(false);
        }
    };

    if (user?.email !== ADMIN_EMAIL) {
        return <div className="p-8 text-center"><p>このページへのアクセス権がありません。</p></div>;
    }

    return (
        <div className="max-w-4xl mx-auto p-4 md:p-8">
            {isLoading && <Loading />}
            <h1 className="text-2xl font-bold mb-6 text-gray-800">管理者ダッシュボード</h1>
            {error && <p className="bg-red-100 text-red-700 p-3 rounded-md mb-4">{error}</p>}

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {/* Tag Management */}
                <div className="bg-white p-6 rounded-lg shadow-md">
                    <h2 className="text-xl font-semibold mb-4">タグ管理</h2>
                    <div className="mb-4 flex gap-2">
                        <input type="text" value={newTagName} onChange={(e) => setNewTagName(e.target.value)} placeholder="新しいタグ名" className="flex-grow bg-gray-50 border border-gray-200 rounded-lg py-2 px-4 text-sm focus:outline-none focus:border-primary-500 focus:ring-2 focus:ring-primary-500/50 transition-all" />
                        <button onClick={handleAddTag} className="bg-primary-600 text-white px-4 py-2 rounded-lg text-sm font-bold hover:bg-primary-700 transition-colors shadow-sm">追加</button>
                    </div>
                    <div className="border rounded-lg overflow-hidden">
                        {tags.map(tag => (
                            <ManagerRow key={`tag-${tag.id}`} item={tag} onUpdate={handleUpdateTag} onDelete={handleDeleteTag} />
                        ))}
                    </div>
                </div>

                {/* Area Management */}
                <div className="bg-white p-6 rounded-lg shadow-md">
                    <h2 className="text-xl font-semibold mb-4">エリア管理</h2>
                    <div className="mb-4 flex gap-2">
                        <input type="text" value={newAreaName} onChange={(e) => setNewAreaName(e.target.value)} placeholder="新しいエリア名" className="flex-grow bg-gray-50 border border-gray-200 rounded-lg py-2 px-4 text-sm focus:outline-none focus:border-primary-500 focus:ring-2 focus:ring-primary-500/50 transition-all" />
                        <button onClick={handleAddArea} className="bg-primary-600 text-white px-4 py-2 rounded-lg text-sm font-bold hover:bg-primary-700 transition-colors shadow-sm">追加</button>
                    </div>
                    <div className="border rounded-lg overflow-hidden">
                        {areas.map(area => (
                            <ManagerRow key={`area-${area.id}`} item={area} onUpdate={handleUpdateArea} onDelete={handleDeleteArea} />
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AdminPage;
