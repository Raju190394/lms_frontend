"use client";
import { useEffect, useState, use } from "react";
import api from "@/lib/api";
import { Button, buttonVariants } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Plus, Video, Trash2, ChevronDown, ChevronUp, FileVideo, Upload } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
} from "@/components/ui/dialog";

export default function CourseContentManagement({ params }) {
  const { id: courseId } = use(params);
  const [course, setCourse] = useState(null);
  const [loading, setLoading] = useState(true);
  
  // Modals state
  const [moduleModalOpen, setModuleModalOpen] = useState(false);
  const [lessonModalOpen, setLessonModalOpen] = useState(false);
  const [activeModuleId, setActiveModuleId] = useState(null);

  // Form states
  const [moduleTitle, setModuleTitle] = useState("");
  const [lessonData, setLessonData] = useState({ title: "", videoUrl: "", releaseDate: "" });
  const [isUploading, setIsUploading] = useState(false);

  const fetchCourseDetails = async () => {
    try {
      const { data } = await api.get(`/courses/${courseId}`);
      if (data.success) {
        setCourse(data.data);
      }
    } catch (err) {
      console.error("Failed to fetch course details", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCourseDetails();
  }, [courseId]);

  const handleAddModule = async (e) => {
    e.preventDefault();
    try {
      await api.post(`/courses/${courseId}/modules`, { title: moduleTitle, order: course.modules.length });
      setModuleModalOpen(false);
      setModuleTitle("");
      fetchCourseDetails();
    } catch (err) {
      alert("Failed to add module");
    }
  };

  const handleVideoUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const formData = new FormData();
    formData.append("video", file);

    setIsUploading(true);
    try {
      const { data } = await api.post("/courses/upload-video", formData, {
        headers: { "Content-Type": "multipart/form-data" }
      });
      if (data.success) {
        setLessonData({ ...lessonData, videoUrl: data.videoUrl });
        alert("Video uploaded successfully!");
      }
    } catch (err) {
      alert("Upload failed");
    } finally {
      setIsUploading(false);
    }
  };

  const handleAddLesson = async (e) => {
    e.preventDefault();
    try {
      await api.post(`/courses/modules/${activeModuleId}/lessons`, lessonData);
      setLessonModalOpen(false);
      setLessonData({ title: "", videoUrl: "", releaseDate: "" });
      fetchCourseDetails();
    } catch (err) {
      alert("Failed to add lesson");
    }
  };

  const handleDeleteModule = async (moduleId) => {
    if (!confirm("Are you sure you want to delete this module and all its lessons?")) return;
    try {
      await api.delete(`/courses/modules/${moduleId}`);
      fetchCourseDetails();
    } catch (err) {
      alert("Failed to delete module");
    }
  };

  const handleDeleteLesson = async (lessonId) => {
    if (!confirm("Are you sure you want to delete this lesson?")) return;
    try {
      await api.delete(`/courses/lessons/${lessonId}`);
      fetchCourseDetails();
    } catch (err) {
      alert("Failed to delete lesson");
    }
  };

  if (loading) return <div className="p-10 text-center">Loading course structure...</div>;

  return (
    <div className="max-w-5xl mx-auto space-y-6 py-4 px-4">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">{course.title}</h1>
          <p className="text-gray-500 text-sm">Manage modules and video lessons</p>
        </div>
        
        <Dialog open={moduleModalOpen} onOpenChange={setModuleModalOpen}>
          <DialogTrigger className={cn(buttonVariants({ variant: "default" }), "gap-2")}>
            <Plus className="h-4 w-4" />
            Add Module
          </DialogTrigger>
          <DialogContent>
            <form onSubmit={handleAddModule}>
              <DialogHeader>
                <DialogTitle>Add New Module</DialogTitle>
              </DialogHeader>
              <div className="py-4">
                <Label htmlFor="mtitle">Module Title</Label>
                <Input id="mtitle" value={moduleTitle} onChange={(e) => setModuleTitle(e.target.value)} placeholder="e.g. Introduction to React" required />
              </div>
              <DialogFooter>
                <Button type="submit">Create Module</Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <div className="space-y-4">
        {course.modules.sort((a, b) => a.order - b.order).map((module) => (
          <Card key={module.id} className="border-l-4 border-l-blue-500 shadow-sm border-gray-100">
            <CardHeader className="flex flex-row items-center justify-between py-3 px-4">
              <CardTitle className="text-lg flex items-center gap-2">
                <div className="bg-blue-100 text-blue-600 p-1.5 rounded text-xs">MOD</div>
                {module.title}
              </CardTitle>
              <div className="flex items-center gap-2">
                <Button 
                  variant="outline" 
                  size="sm" 
                  className="gap-1 text-xs"
                  onClick={() => {
                    setActiveModuleId(module.id);
                    setLessonModalOpen(true);
                  }}
                >
                  <Plus className="h-3 w-3" />
                  Add Lesson
                </Button>
                <Button 
                  variant="ghost" 
                  size="icon" 
                  className="text-red-500"
                  onClick={() => handleDeleteModule(module.id)}
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            </CardHeader>
            <CardContent className="pt-0 pb-3 px-4">
              <div className="space-y-1.5 border-t pt-3">
                {module.lessons.sort((a, b) => a.order - b.order).map((lesson) => (
                  <div key={lesson.id} className="flex items-center justify-between p-2.5 bg-gray-50 rounded-lg group border border-transparent hover:border-gray-100 transition-all">
                    <div className="flex items-center gap-3">
                      <Video className="h-4 w-4 text-gray-400" />
                      <div>
                        <p className="text-sm font-medium">{lesson.title}</p>
                        {lesson.videoUrl && (
                          <p className="text-[10px] text-green-600 flex items-center gap-1">
                            <FileVideo className="h-2.5 w-2.5" /> Video Linked
                          </p>
                        )}
                      </div>
                    </div>
                    <Button 
                      variant="ghost" 
                      size="icon" 
                      className="h-8 w-8 opacity-0 group-hover:opacity-100 transition-opacity"
                      onClick={() => handleDeleteLesson(lesson.id)}
                    >
                      <Trash2 className="h-3.5 w-3.5 text-red-500" />
                    </Button>
                  </div>
                ))}
                {module.lessons.length === 0 && (
                  <p className="text-xs text-gray-400 italic text-center py-2">No lessons added yet.</p>
                )}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Lesson Modal */}
      <Dialog open={lessonModalOpen} onOpenChange={setLessonModalOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <form onSubmit={handleAddLesson}>
            <DialogHeader>
              <DialogTitle>Add New Lesson</DialogTitle>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid gap-2">
                <Label htmlFor="ltitle">Lesson Title</Label>
                <Input id="ltitle" value={lessonData.title} onChange={(e) => setLessonData({...lessonData, title: e.target.value})} placeholder="e.g. Setting up the environment" required />
              </div>
              <div className="grid gap-2">
                <Label>Upload Video</Label>
                <div className="flex items-center gap-2">
                  <Input type="file" accept="video/*" onChange={handleVideoUpload} className="cursor-pointer" />
                  {isUploading && <span className="text-xs animate-pulse text-blue-600">Uploading...</span>}
                </div>
                {lessonData.videoUrl && <p className="text-[10px] text-gray-500 truncate">{lessonData.videoUrl}</p>}
              </div>
              <div className="grid gap-2">
                <Label htmlFor="rdate">Release Date (Optional)</Label>
                <Input id="rdate" type="date" value={lessonData.releaseDate} onChange={(e) => setLessonData({...lessonData, releaseDate: e.target.value})} />
              </div>
            </div>
            <DialogFooter>
              <Button type="submit" disabled={isUploading}>Add Lesson</Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
