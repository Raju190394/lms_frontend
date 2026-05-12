"use client";
import { useEffect, useState, use } from "react";
import api from "@/lib/api";
import VideoPlayer from "@/components/shared/VideoPlayer";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { PlayCircle, CheckCircle, ChevronRight, Lock } from "lucide-react";
import { cn } from "@/lib/utils";

export default function CourseViewer({ params }) {
  const { id: courseId } = use(params);
  const [course, setCourse] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeLesson, setActiveLesson] = useState(null);

  useEffect(() => {
    const fetchCourse = async () => {
      try {
        const { data } = await api.get(`/courses/${courseId}`);
        if (data.success) {
          setCourse(data.data);
          // Set first lesson as active by default
          if (data.data.modules?.[0]?.lessons?.[0]) {
            setActiveLesson(data.data.modules[0].lessons[0]);
          }
        }
      } catch (err) {
        console.error("Failed to fetch course", err);
      } finally {
        setLoading(false);
      }
    };
    fetchCourse();
  }, [courseId]);

  if (loading) return <div className="p-10 text-center">Loading course...</div>;
  if (!course) return <div className="p-10 text-center">Course not found.</div>;

  return (
    <div className="flex flex-col lg:flex-row min-h-[calc(100vh-80px)]">
      {/* Video Player Section */}
      <div className="flex-1 p-4 lg:p-8">
        {activeLesson ? (
          <div className="space-y-6">
            <VideoPlayer lessonId={activeLesson.id} key={activeLesson.id} />
            <div>
              <h1 className="text-2xl font-bold text-gray-900">{activeLesson.title}</h1>
              <p className="text-gray-500 mt-2">Part of module: {course.modules.find(m => m.lessons.some(l => l.id === activeLesson.id))?.title}</p>
            </div>
          </div>
        ) : (
          <div className="h-96 flex flex-col items-center justify-center bg-gray-100 rounded-lg">
            <PlayCircle className="h-12 w-12 text-gray-400 mb-4" />
            <p className="text-gray-500">Select a lesson to start watching</p>
          </div>
        )}
      </div>

      {/* Sidebar Content List */}
      <div className="w-full lg:w-96 border-l bg-white overflow-y-auto">
        <div className="p-4 border-b bg-gray-50">
          <h2 className="font-bold text-lg">{course.title}</h2>
          <p className="text-sm text-gray-500">Course Content</p>
        </div>

        <div className="divide-y">
          {course.modules.sort((a, b) => a.order - b.order).map((module) => (
            <div key={module.id} className="py-2">
              <div className="px-4 py-2 bg-gray-100/50">
                <span className="text-xs font-bold text-gray-400 uppercase tracking-wider">Module: {module.title}</span>
              </div>
              <div className="mt-1">
                {module.lessons.sort((a, b) => a.order - b.order).map((lesson) => (
                  <button
                    key={lesson.id}
                    onClick={() => setActiveLesson(lesson)}
                    className={cn(
                      "w-full flex items-center gap-3 px-4 py-3 text-sm hover:bg-blue-50 transition-colors border-l-4",
                      activeLesson?.id === lesson.id 
                        ? "bg-blue-50 border-blue-600 text-blue-700" 
                        : "border-transparent text-gray-600"
                    )}
                  >
                    <PlayCircle className={cn("h-4 w-4", activeLesson?.id === lesson.id ? "text-blue-600" : "text-gray-400")} />
                    <span className="flex-1 text-left line-clamp-1">{lesson.title}</span>
                  </button>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
