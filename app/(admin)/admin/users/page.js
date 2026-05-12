"use client";
import { useEffect, useState } from "react";
import api from "@/lib/api";
import { cn } from "@/lib/utils";
import { useAuthStore } from "@/store/authStore";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button, buttonVariants } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { CheckCircle, XCircle, User, Plus } from "lucide-react";
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";

export default function UsersManagement() {
  const { user: currentUser } = useAuthStore();
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [open, setOpen] = useState(false);
  const [editingUser, setEditingUser] = useState(null);
  
  // Form state
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    role: "USER",
    isVerified: false,
    isActive: true
  });

  const fetchUsers = async () => {
    try {
      const { data } = await api.get("/users");
      if (data.success) {
        setUsers(data.data);
      }
    } catch (err) {
      console.error("Failed to fetch users", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const resetForm = () => {
    setFormData({ name: "", email: "", password: "", role: "USER", isVerified: false, isActive: true });
    setEditingUser(null);
  };

  const handleCreateUser = async (e) => {
    e.preventDefault();
    try {
      const { data } = await api.post("/users", formData);
      if (data.success) {
        setOpen(false);
        resetForm();
        fetchUsers();
      }
    } catch (err) {
      alert(err.response?.data?.message || "Failed to create user");
    }
  };

  const handleUpdateUser = async (e) => {
    e.preventDefault();
    try {
      const { data } = await api.put(`/users/${editingUser.id}`, formData);
      if (data.success) {
        setOpen(false);
        resetForm();
        fetchUsers();
      }
    } catch (err) {
      alert(err.response?.data?.message || "Failed to update user");
    }
  };

  const handleEditClick = (user) => {
    setEditingUser(user);
    setFormData({
      name: user.name,
      email: user.email,
      password: "", // Don't pre-fill password for security
      role: user.role,
      isVerified: user.isVerified,
      isActive: user.isActive
    });
    setOpen(true);
  };

  const handleVerify = async (userId) => {
    try {
      const { data } = await api.patch(`/users/${userId}/verify`);
      if (data.success) {
        fetchUsers();
      }
    } catch (err) {
      console.error("Verification failed", err);
    }
  };

  if (loading) return <div>Loading users...</div>;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold tracking-tight">User Management</h1>
        
        <Dialog open={open} onOpenChange={(val) => {
          setOpen(val);
          if (!val) resetForm();
        }}>
        <DialogTrigger render={
          <Button className="gap-2" onClick={() => resetForm()}>
            <Plus className="h-4 w-4" />
            Create User
          </Button>
        } />
          <DialogContent className="sm:max-w-[425px]">
            <form onSubmit={editingUser ? handleUpdateUser : handleCreateUser}>
              <DialogHeader>
                <DialogTitle>{editingUser ? "Edit User" : "Add New User"}</DialogTitle>
                <DialogDescription>
                  {editingUser ? "Modify user account details." : "Create a new user account manually."}
                </DialogDescription>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="name" className="text-right">Name</Label>
                  <Input id="name" value={formData.name} onChange={(e) => setFormData({...formData, name: e.target.value})} className="col-span-3" required />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="email" className="text-right">Email</Label>
                  <Input id="email" type="email" value={formData.email} onChange={(e) => setFormData({...formData, email: e.target.value})} className="col-span-3" required />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="pass" className="text-right">Password</Label>
                  <Input id="pass" type="password" placeholder={editingUser ? "Leave blank to keep current" : "Enter password"} value={formData.password} onChange={(e) => setFormData({...formData, password: e.target.value})} className="col-span-3" required={!editingUser} />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label className="text-right">Role</Label>
                  <div className="col-span-3">
                    <Select value={formData.role} onValueChange={(val) => setFormData({...formData, role: val})}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select role" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="USER">User</SelectItem>
                        <SelectItem value="ADMIN">Admin</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <div className="flex items-center justify-between px-1">
                  <Label htmlFor="verified">Verified Account</Label>
                  <Switch id="verified" checked={formData.isVerified} onCheckedChange={(val) => setFormData({...formData, isVerified: val})} />
                </div>
                <div className="flex items-center justify-between px-1">
                  <Label htmlFor="active">Active Account</Label>
                  <Switch 
                    id="active" 
                    checked={formData.isActive} 
                    onCheckedChange={(val) => setFormData({...formData, isActive: val})} 
                    disabled={editingUser?.id === currentUser?.id}
                  />
                </div>
              </div>
              <DialogFooter>
                <Button type="submit">{editingUser ? "Save Changes" : "Create User"}</Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>All Registered Users</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>User</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Role</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Joined</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {users.map((user) => (
                <TableRow key={user.id}>
                  <TableCell className="font-medium">
                    <div className="flex items-center gap-2">
                      <div className="h-8 w-8 rounded-full bg-gray-100 flex items-center justify-center">
                        <User className="h-4 w-4 text-gray-500" />
                      </div>
                      {user.name}
                    </div>
                  </TableCell>
                  <TableCell>{user.email}</TableCell>
                  <TableCell>
                    <Badge variant={user.role === "ADMIN" ? "default" : "secondary"}>
                      {user.role}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <div className="flex flex-col gap-1">
                      {user.isVerified ? (
                        <div className="flex items-center text-green-600 gap-1">
                          <CheckCircle className="h-4 w-4" />
                          <span className="text-sm">Verified</span>
                        </div>
                      ) : (
                        <div className="flex items-center text-amber-600 gap-1">
                          <XCircle className="h-4 w-4" />
                          <span className="text-sm">Unverified</span>
                        </div>
                      )}
                      {user.isActive ? (
                        <Badge variant="outline" className="text-green-600 border-green-200 bg-green-50 w-fit">Active</Badge>
                      ) : (
                        <Badge variant="outline" className="text-red-600 border-red-200 bg-red-50 w-fit">Inactive</Badge>
                      )}
                    </div>
                  </TableCell>
                  <TableCell>{new Date(user.createdAt).toLocaleDateString()}</TableCell>
                  <TableCell className="text-right flex items-center justify-end gap-2">
                    <Button 
                      size="sm" 
                      variant="outline" 
                      onClick={() => handleEditClick(user)}
                    >
                      Edit
                    </Button>
                    {!user.isVerified && (
                      <Button 
                        size="sm" 
                        variant="outline" 
                        className="text-blue-600 hover:text-blue-700"
                        onClick={() => handleVerify(user.id)}
                        disabled={user.id === currentUser?.id}
                      >
                        Verify User
                      </Button>
                    )}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
