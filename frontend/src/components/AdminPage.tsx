import React, { useState, useEffect } from 'react';
import { auth } from '../firebase';
import { fetchTags, createTag, updateTag, deleteTag } from '../apis/tags';
import { fetchAreas, createArea, updateArea, deleteArea } from '../apis/areas';
import { Tag, Area } from '../types';
import Loading from './Loading';

const ADMIN_EMAIL = process.env.REACT_APP_ADMIN_EMAIL as string;

const TagRow = (
  { tag, onUpdate, onDelete }:
  { tag: Tag, onUpdate: (id: number, name: string) => Promise<void>, onDelete: (id: number) => Promise<void> }
) => {
    const [isEditing, setIsEditing] = useState(false);
    const [name, setName] = useState(tag.name);

    const handleUpdate = async () => {
        await onUpdate(tag.id, name);
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
                <span className="text-sm text-gray-700">{tag.name}</span>
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
                      <button onClick={() => onDelete(tag.id)} className="ml-2 text-sm font-semibold text-red-600 hover:text-red-700">削除</button>
                    </>
                )}
            </div>
        </div>
    );
};

const AreaRow = (
  { area, onUpdate, onDelete }:
  { area: Area, onUpdate: (id: number, params: { name: string, lat?: number, lng?: number }) => Promise<void>, onDelete: (id: number) => Promise<void> }
) => {
    const [isEditing, setIsEditing] = useState(false);
    const [name, setName] = useState(area.name);
    const [lat, setLat] = useState(area.lat?.toString() || '');
    const [lng, setLng] = useState(area.lng?.toString() || '');

    const handleUpdate = async () => {
        await onUpdate(area.id, { 
            name, 
            lat: lat ? parseFloat(lat) : undefined, 
            lng: lng ? parseFloat(lng) : undefined 
        });
        setIsEditing(false);
    };

    return (
        <div className="p-3 border-b hover:bg-gray-50 transition-colors">
            {isEditing ? (
                <div className="space-y-2">
                    <input
                        type="text"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        placeholder="エリア名"
                        className="border rounded-md px-2 py-1 text-sm w-full"
                    />
                    <div className="flex gap-2">
                        <input
                            type="number"
                            value={lat}
                            onChange={(e) => setLat(e.target.value)}
                            placeholder="緯度"
                            className="border rounded-md px-2 py-1 text-sm w-1/2"
                        />
                        <input
                            type="number"
                            value={lng}
                            onChange={(e) => setLng(e.target.value)}
                            placeholder="経度"
                            className="border rounded-md px-2 py-1 text-sm w-1/2"
                        />
                    </div>
                    <div className="flex justify-end gap-2">
                        <button onClick={handleUpdate} className="text-sm font-semibold text-primary-600 hover:text-primary-700">保存</button>
                        <button onClick={() => setIsEditing(false)} className="text-sm text-gray-500 hover:text-gray-700">キャンセル</button>
                    </div>
                </div>
            ) : (
                <div className="flex items-center justify-between">
                    <div>
                        <div className="text-sm font-medium text-gray-700">{area.name}</div>
                        <div className="text-xs text-gray-400">
                            {area.lat && area.lng ? `${area.lat}, ${area.lng}` : '座標未設定'}
                        </div>
                    </div>
                    <div className="flex items-center flex-shrink-0 ml-4">
                        <button onClick={() => setIsEditing(true)} className="text-sm font-semibold text-blue-600 hover:text-blue-700">編集</button>
                        <button onClick={() => onDelete(area.id)} className="ml-2 text-sm font-semibold text-red-600 hover:text-red-700">削除</button>
                    </div>
                </div>
            )}
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
    const [newAreaLat, setNewAreaLat] = useState('');
    const [newAreaLng, setNewAreaLng] = useState('');

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
            const params = {
                name: newAreaName,
                lat: newAreaLat ? parseFloat(newAreaLat) : undefined,
                lng: newAreaLng ? parseFloat(newAreaLng) : undefined
            };
            const newArea = await createArea(params);
            setAreas([...areas, newArea]);
            setNewAreaName('');
            setNewAreaLat('');
            setNewAreaLng('');
        } catch (err) {
            setError('エリアの追加に失敗しました。');
        } finally {
            setIsLoading(false);
        }
    };

    const handleUpdateArea = async (id: number, params: { name: string, lat?: number, lng?: number }) => {
        setIsLoading(true);
        try {
            const updatedArea = await updateArea(id, params);
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
                            <TagRow key={`tag-${tag.id}`} tag={tag} onUpdate={handleUpdateTag} onDelete={handleDeleteTag} />
                        ))}
                    </div>
                </div>

                {/* Area Management */}
                <div className="bg-white p-6 rounded-lg shadow-md">
                    <h2 className="text-xl font-semibold mb-4">エリア管理</h2>
                    <div className="space-y-2 mb-4">
                        <input type="text" value={newAreaName} onChange={(e) => setNewAreaName(e.target.value)} placeholder="新しいエリア名" className="w-full bg-gray-50 border border-gray-200 rounded-lg py-2 px-4 text-sm focus:outline-none focus:border-primary-500 transition-all" />
                        <div className="flex gap-2">
                            <input type="number" value={newAreaLat} onChange={(e) => setNewAreaLat(e.target.value)} placeholder="緯度" className="w-1/2 bg-gray-50 border border-gray-200 rounded-lg py-2 px-4 text-sm focus:outline-none focus:border-primary-500 transition-all" />
                            <input type="number" value={newAreaLng} onChange={(e) => setNewAreaLng(e.target.value)} placeholder="経度" className="w-1/2 bg-gray-50 border border-gray-200 rounded-lg py-2 px-4 text-sm focus:outline-none focus:border-primary-500 transition-all" />
                        </div>
                        <button onClick={handleAddArea} className="w-full bg-primary-600 text-white px-4 py-2 rounded-lg text-sm font-bold hover:bg-primary-700 transition-colors shadow-sm">エリア追加</button>
                    </div>
                    <div className="border rounded-lg overflow-hidden">
                        {areas.map(area => (
                            <AreaRow key={`area-${area.id}`} area={area} onUpdate={handleUpdateArea} onDelete={handleDeleteArea} />
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AdminPage;
