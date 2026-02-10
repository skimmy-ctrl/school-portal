import { useState } from 'react';
import { Card, CardBody, CardHeader } from '../../../components/common/Card';
import Button from '../../../components/common/Button';
import Input from '../../../components/common/Input';
import Badge from '../../../components/common/Badge';
import { motion } from 'framer-motion';

interface AnnouncementRecord {
  id: string;
  title: string;
  content: string;
  author: string;
  date: string;
  priority: 'normal' | 'high';
  audience: ('student' | 'teacher' | 'admin')[];
  published: boolean;
}

const initialAnnouncements: AnnouncementRecord[] = [
  {
    id: 'a1',
    title: 'Mid-Semester Exam Schedule Released',
    content: 'The mid-semester exam schedule has been released. Check timetable for details.',
    author: 'Academic Office',
    date: '2024-01-26',
    priority: 'high',
    audience: ['student','teacher'],
    published: true,
  },
  {
    id: 'a2',
    title: 'Library New Resources',
    content: '200+ new books and journals added to the library catalogue.',
    author: 'Library Team',
    date: '2024-01-25',
    priority: 'normal',
    audience: ['student','teacher','admin'],
    published: true,
  },
];

export function AnnouncementsPage() {
  const [announcements, setAnnouncements] = useState<AnnouncementRecord[]>(initialAnnouncements);
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [priority, setPriority] = useState<'normal' | 'high'>('normal');
  const [audience, setAudience] = useState<string>('student');

  const addAnnouncement = () => {
    if (!title.trim() || !content.trim()) return;
    const newAnn: AnnouncementRecord = {
      id: `a${Date.now()}`,
      title: title.trim(),
      content: content.trim(),
      author: 'Admin',
      date: new Date().toISOString().split('T')[0],
      priority,
      audience: [audience as AnnouncementRecord['audience'][0]],
      published: true,
    };
    setAnnouncements(prev => [newAnn, ...prev]);
    setTitle('');
    setContent('');
    setPriority('normal');
    setAudience('student');
  };

  const togglePublish = (id: string) => {
    setAnnouncements(prev => prev.map(a => a.id === id ? { ...a, published: !a.published } : a));
  };

  const removeAnnouncement = (id: string) => {
    setAnnouncements(prev => prev.filter(a => a.id !== id));
  };

  return (
    <div className="space-y-6">
      <motion.div initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }}>
        <h1 className="text-3xl font-bold text-gray-900">Announcements</h1>
        <p className="text-gray-600 mt-2">Create, publish, and manage school-wide announcements.</p>
      </motion.div>

      <Card>
        <CardHeader title="Create Announcement" />
        <CardBody>
          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              <Input value={title} onChange={(e) => setTitle(e.target.value)} placeholder="Title" />
              <select value={priority} onChange={(e) => setPriority(e.target.value as any)} className="px-3 py-2 border rounded-lg">
                <option value="normal">Normal</option>
                <option value="high">High Priority</option>
              </select>
              <select value={audience} onChange={(e) => setAudience(e.target.value)} className="px-3 py-2 border rounded-lg">
                <option value="student">Students</option>
                <option value="teacher">Teachers</option>
                <option value="admin">Admins</option>
              </select>
            </div>
            <div>
              <textarea value={content} onChange={(e) => setContent(e.target.value)} placeholder="Announcement content" className="w-full p-3 border rounded-lg h-28 resize-none" />
            </div>
            <div className="flex items-center gap-2">
              <Button onClick={addAnnouncement}>Publish</Button>
              <Button variant="secondary" onClick={() => { setTitle(''); setContent(''); setPriority('normal'); setAudience('student'); }}>Reset</Button>
            </div>
          </div>
        </CardBody>
      </Card>

      <Card>
        <CardHeader title={`All Announcements (${announcements.length})`} />
        <CardBody>
          <div className="space-y-3">
            {announcements.map((a) => (
              <div key={a.id} className="p-4 border rounded-lg">
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <h3 className="font-semibold text-gray-900 truncate">{a.title}</h3>
                      {a.priority === 'high' && <Badge variant="danger">Urgent</Badge>}
                    </div>
                    <p className="text-sm text-gray-600 mt-2">{a.content}</p>
                    <p className="text-xs text-gray-500 mt-2">{a.author} • {a.date} • {a.audience.join(', ')}</p>
                  </div>
                  <div className="flex flex-col items-end gap-2">
                    <div className="flex items-center gap-2">
                      <Button size="sm" variant="secondary" onClick={() => togglePublish(a.id)}>{a.published ? 'Unpublish' : 'Publish'}</Button>
                      <Button size="sm" variant="danger" onClick={() => removeAnnouncement(a.id)}>Delete</Button>
                    </div>
                    <div className="text-sm text-gray-600">{a.published ? 'Published' : 'Draft'}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardBody>
      </Card>
    </div>
  );
}
