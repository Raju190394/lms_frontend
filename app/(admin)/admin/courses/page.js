"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import api from "@/lib/api";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Plus, Edit, Trash2, Eye } from "lucide-react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { buttonVariants } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";

export default function CoursesManagement() {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [open, setOpen] = useState(false);
  const [editingCourse, setEditingCourse] = useState(null);

  // Form state
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    price: "",
    thumbnail: "",
    isPublished: false,
  });

  const fetchCourses = async () => {
    try {
      const { data } = await api.get("/courses");
      if (data.success) {
        setCourses(data.data);
      }
    } catch (err) {
      console.error("Failed to fetch courses", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCourses();
  }, []);

  const resetForm = () => {
    setFormData({ title: "", description: "", price: "", thumbnail: "", isPublished: false });
    setEditingCourse(null);
  };

  const handleCreateCourse = async (e) => {
    e.preventDefault();
    try {
      const { data } = await api.post("/courses", formData);
      if (data.success) {
        setOpen(false);
        resetForm();
        fetchCourses();
      }
    } catch (err) {
      alert(err.response?.data?.message || "Failed to create course");
    }
  };

  const handleUpdateCourse = async (e) => {
    e.preventDefault();
    try {
      const { data } = await api.put(`/courses/${editingCourse.id}`, formData);
      if (data.success) {
        setOpen(false);
        resetForm();
        fetchCourses();
      }
    } catch (err) {
      alert(err.response?.data?.message || "Failed to update course");
    }
  };

  const handleEditClick = (course) => {
    setEditingCourse(course);
    setFormData({
      title: course.title,
      description: course.description || "",
      price: course.price.toString(),
      thumbnail: course.thumbnail || "",
      isPublished: course.isPublished,
    });
    setOpen(true);
  };

  const handleThumbnailUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const uploadFormData = new FormData();
    uploadFormData.append("image", file);

    try {
      const { data } = await api.post("/courses/upload-thumbnail", uploadFormData, {
        headers: { "Content-Type": "multipart/form-data" }
      });
      if (data.success) {
        setFormData({ ...formData, thumbnail: data.url });
      }
    } catch (err) {
      alert("Thumbnail upload failed");
    }
  };

  if (loading) return <div className="flex h-[60vh] items-center justify-center">Loading courses...</div>;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold tracking-tight text-gray-900">Course Management</h1>
        
        <Dialog open={open} onOpenChange={(val) => {
          setOpen(val);
          if (!val) resetForm();
        }}>
          <DialogTrigger render={
            <Button className="gap-2" onClick={() => resetForm()}>
              <Plus className="h-4 w-4" />
              Create New Course
            </Button>
          } />
          <DialogContent className="sm:max-w-[525px] max-h-[90vh] overflow-y-auto">
            <form onSubmit={editingCourse ? handleUpdateCourse : handleCreateCourse}>
              <DialogHeader>
                <DialogTitle>{editingCourse ? "Edit Course" : "Create New Course"}</DialogTitle>
                <DialogDescription>
                  {editingCourse ? "Modify existing course details." : "Add a new course to the platform."}
                </DialogDescription>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div className="grid gap-2">
                  <Label htmlFor="title">Course Title</Label>
                  <Input id="title" value={formData.title} onChange={(e) => setFormData({...formData, title: e.target.value})} placeholder="e.g. Full Stack Web Development" required />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="desc">Description</Label>
                  <Textarea id="desc" value={formData.description} onChange={(e) => setFormData({...formData, description: e.target.value})} placeholder="Describe what users will learn..." />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="grid gap-2">
                    <Label htmlFor="price">Price ($)</Label>
                    <Input id="price" type="number" step="0.01" value={formData.price} onChange={(e) => setFormData({...formData, price: e.target.value})} placeholder="49.99" required />
                  </div>
                  <div className="flex items-center justify-between pt-6 border-l pl-4">
                    <Label htmlFor="pub">Published</Label>
                    <Switch id="pub" checked={formData.isPublished} onCheckedChange={(val) => setFormData({...formData, isPublished: val})} />
                  </div>
                </div>
                <div className="grid gap-2">
                  <Label>Course Thumbnail</Label>
                  <div className="flex flex-col gap-2">
                    {formData.thumbnail && (
                      <div className="relative aspect-video w-full max-w-[300px] mx-auto rounded-lg overflow-hidden border bg-gray-50">
                        <img 
                          src={formData.thumbnail.startsWith("http") 
                            ? formData.thumbnail 
                            : `${(process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api/v1").replace("/api/v1", "")}${formData.thumbnail}`} 
                          alt="Thumbnail preview" 
                          className="object-cover w-full h-full"
                          onError={(e) => {
                            console.error("Image load failed:", e.target.src);
                            e.target.src = "https://placehold.co/600x400?text=No+Thumbnail";
                          }}
                        />
                      </div>
                    )}
                    <div className="flex gap-2">
                      <Input 
                        type="file" 
                        accept="image/*" 
                        onChange={handleThumbnailUpload} 
                        className="flex-1"
                      />
                    </div>
                    <Input 
                      id="thumb" 
                      value={formData.thumbnail} 
                      onChange={(e) => setFormData({...formData, thumbnail: e.target.value})} 
                      placeholder="Or enter image URL manually..." 
                    />
                  </div>
                </div>
              </div>
              <DialogFooter>
                <Button type="submit">{editingCourse ? "Update Course" : "Create Course"}</Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <Card className="border-none shadow-sm rounded-xl overflow-hidden">
        <CardContent className="p-0">
          <Table>
            <TableHeader className="bg-gray-50/50">
              <TableRow>
                <TableHead className="px-6">Title</TableHead>
                <TableHead>Price</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Created</TableHead>
                <TableHead className="text-right px-6">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {courses.map((course) => (
                <TableRow key={course.id} className="hover:bg-gray-50/50 transition-colors">
                  <TableCell className="px-6 font-medium text-gray-900">{course.title}</TableCell>
                  <TableCell className="font-semibold text-blue-600">${course.price}</TableCell>
                  <TableCell>
                    <Badge className={cn("rounded-md", course.isPublished ? "bg-emerald-50 text-emerald-700 hover:bg-emerald-50" : "bg-gray-100 text-gray-600 hover:bg-gray-100")}>
                      {course.isPublished ? "Published" : "Draft"}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-gray-500">{new Date(course.createdAt).toLocaleDateString()}</TableCell>
                  <TableCell className="text-right px-6 space-x-2">
                    <Link href={`/admin/courses/${course.id}`}>
                      <Button variant="ghost" size="icon" title="Manage Content" className="hover:bg-blue-50 hover:text-blue-600">
                        <Eye className="h-4 w-4" />
                      </Button>
                    </Link>
                    <Button 
                      variant="ghost" 
                      size="icon" 
                      title="Edit Course" 
                      className="hover:bg-blue-50 hover:text-blue-600"
                      onClick={() => handleEditClick(course)}
                    >
                      <Edit className="h-4 w-4" />
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
              {courses.length === 0 && (
                <TableRow>
                  <TableCell colSpan={5} className="text-center py-12 text-gray-400">
                    No courses found. Create your first course!
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
