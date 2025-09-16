"use client";

import { useState } from "react";
import LibraryModal from "./LibraryModal";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Search,
  Plus,
  Edit,
  Trash2,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";

const books = [
  {
    id: "#0011",
    name: "Literature",
    writer: "Wade Warren",
    subject: "English",
    class: "02",
    publishDate: "22 Oct, 2022",
    cover:
      "https://images.pexels.com/photos/256541/pexels-photo-256541.jpeg?auto=compress&cs=tinysrgb&w=400",
  },
  {
    id: "#0021",
    name: "Mathematics",
    writer: "David Morgan",
    subject: "Mathematics",
    class: "01",
    publishDate: "12 Sep, 2023",
    cover:
      "https://images.pexels.com/photos/256417/pexels-photo-256417.jpeg?auto=compress&cs=tinysrgb&w=400",
    selected: true,
  },
  {
    id: "#0031",
    name: "English",
    writer: "Kristin Watson",
    subject: "Physics",
    class: "03",
    publishDate: "23 Nov, 2020",
    cover:
      "https://images.pexels.com/photos/256490/pexels-photo-256490.jpeg?auto=compress&cs=tinysrgb&w=400",
  },
  {
    id: "#0013",
    name: "Mathematics",
    writer: "Savannah Nguyen",
    subject: "Mathematics",
    class: "04",
    publishDate: "12 Oct, 2022",
    cover:
      "https://images.pexels.com/photos/256450/pexels-photo-256450.jpeg?auto=compress&cs=tinysrgb&w=400",
  },
  {
    id: "#0018",
    name: "English",
    writer: "Jacob Jones",
    subject: "Physics",
    class: "01",
    publishDate: "22 Oct, 2022",
    cover:
      "https://images.pexels.com/photos/256520/pexels-photo-256520.jpeg?auto=compress&cs=tinysrgb&w=400",
  },
];

export default function LibraryTable() {
  const [searchQuery, setSearchQuery] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState<"create" | "edit">("create");
  const [selectedBook, setSelectedBook] = useState(null);

  const handleEdit = (book: any) => {
    setModalMode("edit");
    setSelectedBook(book);
    setIsModalOpen(true);
  };

  const handleDelete = (book: any) => {
    if (confirm("Are you sure you want to delete this book?")) {
      console.log("Delete book:", book);
    }
  };

  return (
    <>
      <Card>
        <CardHeader className="flex flex-col space-y-4 sm:flex-row sm:items-center sm:justify-between sm:space-y-0">
          <div>
            <CardTitle className="text-lg sm:text-xl font-semibold">
              All Books
            </CardTitle>
          </div>
          <div className="flex flex-col space-y-3 sm:flex-row sm:items-center sm:space-y-0 sm:space-x-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
              <Input
                type="text"
                placeholder="Search by name or roll"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 w-full sm:w-48 md:w-64"
              />
            </div>
            <Select defaultValue="30">
              <SelectTrigger className="w-full sm:w-32 md:w-40">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="7">Last 7 days</SelectItem>
                <SelectItem value="30">Last 30 days</SelectItem>
                <SelectItem value="90">Last 90 days</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-200">
                  <th className="text-left py-3 px-4">
                    <Checkbox />
                  </th>
                  <th className="text-left py-3 px-4 text-sm font-medium text-gray-600">
                    Book Name
                  </th>
                  <th className="text-left py-3 px-4 text-sm font-medium text-gray-600">
                    Writer
                  </th>
                  <th className="text-left py-3 px-4 text-sm font-medium text-gray-600">
                    Id
                  </th>
                  <th className="text-left py-3 px-4 text-sm font-medium text-gray-600">
                    Subject
                  </th>
                  <th className="text-left py-3 px-4 text-sm font-medium text-gray-600">
                    Class
                  </th>
                  <th className="text-left py-3 px-4 text-sm font-medium text-gray-600">
                    Publish Date
                  </th>
                  <th className="text-right py-3 px-4 text-sm font-medium text-gray-600">
                    Action
                  </th>
                </tr>
              </thead>
              <tbody>
                {books.map((book) => (
                  <tr
                    key={book.id}
                    className="border-b border-border hover:bg-accent transition-colors group"
                  >
                    <td className="py-4 px-4">
                      <Checkbox checked={book.selected} />
                    </td>
                    <td className="py-4 px-4">
                      <div className="flex items-center space-x-3">
                        <Avatar className="w-10 h-10 rounded-lg">
                          <AvatarImage src={book.cover} alt={book.name} />
                          <AvatarFallback className="rounded-lg">
                            {book.name[0]}
                          </AvatarFallback>
                        </Avatar>
                        <span className="font-medium text-foreground group-hover:text-accent-foreground">
                          {book.name}
                        </span>
                      </div>
                    </td>
                    <td className="py-4 px-4 text-muted-foreground group-hover:text-accent-foreground">
                      {book.writer}
                    </td>
                    <td className="py-4 px-4 text-muted-foreground group-hover:text-accent-foreground">
                      {book.id}
                    </td>
                    <td className="py-4 px-4 text-muted-foreground group-hover:text-accent-foreground">
                      {book.subject}
                    </td>
                    <td className="py-4 px-4 text-muted-foreground group-hover:text-accent-foreground">
                      {book.class}
                    </td>
                    <td className="py-4 px-4 text-muted-foreground group-hover:text-accent-foreground">
                      {book.publishDate}
                    </td>
                    <td className="py-4 px-4">
                      <div className="flex items-center justify-end space-x-2">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleEdit(book)}
                        >
                          <Edit className="w-4 h-4 text-muted-foreground hover:text-foreground" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleDelete(book)}
                        >
                          <Trash2 className="w-4 h-4 text-muted-foreground hover:text-destructive" />
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div> 
        </CardContent>
      </Card>

      <LibraryModal
        open={isModalOpen}
        onOpenChange={setIsModalOpen}
        mode={modalMode}
        book={selectedBook}
      />
    </>
  );
}
