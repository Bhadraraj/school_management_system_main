'use client';

import { useState } from 'react';
import LibraryModal from './LibraryModal';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Search, CreditCard as Edit, Trash2, Eye, ChevronLeft, ChevronRight, Barcode } from 'lucide-react';
import Link from 'next/link';

interface Book {
  id: string;
  barcode: string;
  title: string;
  author: string;
  isbn: string;
  publisher: string;
  category: string;
  rackLocation: string;
  totalCopies: number;
  availableCopies: number;
  issuedCopies: number;
  publishDate: string;
  cover: string;
}

const mockBooks: Book[] = [
  {
    id: '1',
    barcode: 'BK001',
    title: 'Introduction to Algorithms',
    author: 'Thomas H. Cormen',
    isbn: '978-0262033848',
    publisher: 'MIT Press',
    category: 'Computer Science',
    rackLocation: 'A-12',
    totalCopies: 10,
    availableCopies: 7,
    issuedCopies: 3,
    publishDate: '2009-07-31',
    cover: 'https://images.pexels.com/photos/256541/pexels-photo-256541.jpeg?auto=compress&cs=tinysrgb&w=400',
  },
  {
    id: '2',
    barcode: 'BK002',
    title: 'Clean Code',
    author: 'Robert C. Martin',
    isbn: '978-0132350884',
    publisher: 'Prentice Hall',
    category: 'Programming',
    rackLocation: 'A-15',
    totalCopies: 8,
    availableCopies: 5,
    issuedCopies: 3,
    publishDate: '2008-08-01',
    cover: 'https://images.pexels.com/photos/256417/pexels-photo-256417.jpeg?auto=compress&cs=tinysrgb&w=400',
  },
  {
    id: '3',
    barcode: 'BK003',
    title: 'The Great Gatsby',
    author: 'F. Scott Fitzgerald',
    isbn: '978-0743273565',
    publisher: 'Scribner',
    category: 'Literature',
    rackLocation: 'B-05',
    totalCopies: 15,
    availableCopies: 12,
    issuedCopies: 3,
    publishDate: '2004-09-30',
    cover: 'https://images.pexels.com/photos/256490/pexels-photo-256490.jpeg?auto=compress&cs=tinysrgb&w=400',
  },
  {
    id: '4',
    barcode: 'BK004',
    title: 'Physics for Scientists',
    author: 'Raymond A. Serway',
    isbn: '978-1133954057',
    publisher: 'Cengage Learning',
    category: 'Physics',
    rackLocation: 'C-08',
    totalCopies: 12,
    availableCopies: 8,
    issuedCopies: 4,
    publishDate: '2013-01-01',
    cover: 'https://images.pexels.com/photos/256450/pexels-photo-256450.jpeg?auto=compress&cs=tinysrgb&w=400',
  },
  {
    id: '5',
    barcode: 'BK005',
    title: 'Advanced Mathematics',
    author: 'James Stewart',
    isbn: '978-1285741550',
    publisher: 'Cengage Learning',
    category: 'Mathematics',
    rackLocation: 'C-12',
    totalCopies: 10,
    availableCopies: 6,
    issuedCopies: 4,
    publishDate: '2015-01-01',
    cover: 'https://images.pexels.com/photos/256520/pexels-photo-256520.jpeg?auto=compress&cs=tinysrgb&w=400',
  },
];

const categories = ['All', 'Computer Science', 'Programming', 'Literature', 'Physics', 'Mathematics'];
const racks = ['All', 'A-12', 'A-15', 'B-05', 'C-08', 'C-12'];

export default function LibraryTable() {
  const [searchQuery, setSearchQuery] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('All');
  const [rackFilter, setRackFilter] = useState('All');
  const [sortField, setSortField] = useState<keyof Book>('title');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc');
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(5);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState<'create' | 'edit'>('create');
  const [selectedBook, setSelectedBook] = useState<Book | null>(null);

  const handleEdit = (book: Book) => {
    setModalMode('edit');
    setSelectedBook(book);
    setIsModalOpen(true);
  };

  const handleDelete = (book: Book) => {
    if (confirm(`Are you sure you want to delete "${book.title}"?`)) {
      console.log('Delete book:', book);
    }
  };

  const handleSort = (field: keyof Book) => {
    if (sortField === field) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortOrder('asc');
    }
  };

  const filteredBooks = mockBooks.filter((book) => {
    const matchesSearch =
      book.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      book.author.toLowerCase().includes(searchQuery.toLowerCase()) ||
      book.barcode.toLowerCase().includes(searchQuery.toLowerCase()) ||
      book.isbn.includes(searchQuery);

    const matchesCategory = categoryFilter === 'All' || book.category === categoryFilter;
    const matchesRack = rackFilter === 'All' || book.rackLocation === rackFilter;

    return matchesSearch && matchesCategory && matchesRack;
  });

  const sortedBooks = [...filteredBooks].sort((a, b) => {
    const aValue = a[sortField];
    const bValue = b[sortField];

    if (typeof aValue === 'number' && typeof bValue === 'number') {
      return sortOrder === 'asc' ? aValue - bValue : bValue - aValue;
    }

    const aStr = String(aValue).toLowerCase();
    const bStr = String(bValue).toLowerCase();

    if (sortOrder === 'asc') {
      return aStr < bStr ? -1 : aStr > bStr ? 1 : 0;
    } else {
      return aStr > bStr ? -1 : aStr < bStr ? 1 : 0;
    }
  });

  const totalPages = Math.ceil(sortedBooks.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentBooks = sortedBooks.slice(startIndex, endIndex);

  const getAvailabilityColor = (available: number, total: number) => {
    const percentage = (available / total) * 100;
    if (percentage > 50) return 'text-green-600';
    if (percentage > 20) return 'text-amber-600';
    return 'text-red-600';
  };

  return (
    <>
      <Card>
        <CardHeader>
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
            <CardTitle className="text-lg sm:text-xl font-semibold">
              All Books ({filteredBooks.length})
            </CardTitle>
            <div className="flex flex-col sm:flex-row gap-3">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                <Input
                  type="text"
                  placeholder="Search by name, author, barcode, ISBN..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10 w-full sm:w-64"
                />
              </div>
              <Select value={categoryFilter} onValueChange={setCategoryFilter}>
                <SelectTrigger className="w-full sm:w-40">
                  <SelectValue placeholder="Category" />
                </SelectTrigger>
                <SelectContent>
                  {categories.map((cat) => (
                    <SelectItem key={cat} value={cat}>
                      {cat}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Select value={rackFilter} onValueChange={setRackFilter}>
                <SelectTrigger className="w-full sm:w-32">
                  <SelectValue placeholder="Rack" />
                </SelectTrigger>
                <SelectContent>
                  {racks.map((rack) => (
                    <SelectItem key={rack} value={rack}>
                      {rack}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-200">
                  <th
                    className="text-left py-3 px-4 text-sm font-medium text-gray-600 cursor-pointer hover:text-gray-900"
                    onClick={() => handleSort('barcode')}
                  >
                    Barcode {sortField === 'barcode' && (sortOrder === 'asc' ? '↑' : '↓')}
                  </th>
                  <th
                    className="text-left py-3 px-4 text-sm font-medium text-gray-600 cursor-pointer hover:text-gray-900"
                    onClick={() => handleSort('title')}
                  >
                    Book Title {sortField === 'title' && (sortOrder === 'asc' ? '↑' : '↓')}
                  </th>
                  <th
                    className="text-left py-3 px-4 text-sm font-medium text-gray-600 cursor-pointer hover:text-gray-900"
                    onClick={() => handleSort('author')}
                  >
                    Author {sortField === 'author' && (sortOrder === 'asc' ? '↑' : '↓')}
                  </th>
                  <th className="text-left py-3 px-4 text-sm font-medium text-gray-600">
                    ISBN
                  </th>
                  <th className="text-left py-3 px-4 text-sm font-medium text-gray-600">
                    Publisher
                  </th>
                  <th className="text-left py-3 px-4 text-sm font-medium text-gray-600">
                    Category
                  </th>
                  <th className="text-left py-3 px-4 text-sm font-medium text-gray-600">
                    Rack
                  </th>
                  <th className="text-center py-3 px-4 text-sm font-medium text-gray-600">
                    Copies
                  </th>
                  <th className="text-right py-3 px-4 text-sm font-medium text-gray-600">
                    Action
                  </th>
                </tr>
              </thead>
              <tbody>
                {currentBooks.map((book) => (
                  <tr
                    key={book.id}
                    className="border-b border-border hover:bg-accent transition-colors group"
                  >
                    <td className="py-4 px-4">
                      <div className="flex items-center gap-2">
                        <Barcode className="w-4 h-4 text-muted-foreground" />
                        <span className="font-mono text-sm">{book.barcode}</span>
                      </div>
                    </td>
                    <td className="py-4 px-4">
                      <div className="flex items-center space-x-3">
                        <Avatar className="w-12 h-12 rounded">
                          <AvatarImage src={book.cover} alt={book.title} />
                          <AvatarFallback className="rounded">
                            {book.title[0]}
                          </AvatarFallback>
                        </Avatar>
                        <span className="font-medium text-foreground group-hover:text-accent-foreground max-w-[200px] truncate">
                          {book.title}
                        </span>
                      </div>
                    </td>
                    <td className="py-4 px-4 text-muted-foreground group-hover:text-accent-foreground">
                      {book.author}
                    </td>
                    <td className="py-4 px-4 text-muted-foreground group-hover:text-accent-foreground text-sm font-mono">
                      {book.isbn}
                    </td>
                    <td className="py-4 px-4 text-muted-foreground group-hover:text-accent-foreground">
                      {book.publisher}
                    </td>
                    <td className="py-4 px-4">
                      <Badge variant="outline">{book.category}</Badge>
                    </td>
                    <td className="py-4 px-4">
                      <Badge variant="secondary">{book.rackLocation}</Badge>
                    </td>
                    <td className="py-4 px-4">
                      <div className="text-center space-y-1">
                        <div className="flex items-center justify-center gap-2 text-sm">
                          <span className={getAvailabilityColor(book.availableCopies, book.totalCopies)}>
                            {book.availableCopies}
                          </span>
                          <span className="text-muted-foreground">/</span>
                          <span className="text-muted-foreground">{book.totalCopies}</span>
                        </div>
                        <div className="text-xs text-muted-foreground">
                          {book.issuedCopies} issued
                        </div>
                      </div>
                    </td>
                    <td className="py-4 px-4">
                      <div className="flex items-center justify-end space-x-2">
                        <Link href={`/library/${book.id}`}>
                          <Button variant="ghost" size="sm">
                            <Eye className="w-4 h-4 text-muted-foreground hover:text-foreground" />
                          </Button>
                        </Link>
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

          {totalPages > 1 && (
            <div className="flex items-center justify-between mt-4 pt-4 border-t">
              <div className="text-sm text-muted-foreground">
                Showing {startIndex + 1} to {Math.min(endIndex, filteredBooks.length)} of {filteredBooks.length} books
              </div>
              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                  disabled={currentPage === 1}
                >
                  <ChevronLeft className="w-4 h-4" />
                </Button>
                <span className="text-sm">
                  Page {currentPage} of {totalPages}
                </span>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                  disabled={currentPage === totalPages}
                >
                  <ChevronRight className="w-4 h-4" />
                </Button>
              </div>
            </div>
          )}
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
