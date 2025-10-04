'use client';

import { useParams, useRouter } from 'next/navigation';
import Layout from '@/components/layout/Layout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { ArrowLeft, Barcode, BookOpen, Calendar, MapPin, User, Building2, Tag, Copy, CreditCard as Edit, Trash2 } from 'lucide-react';
import Link from 'next/link';

const mockBooks = [
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
    description: 'This book provides a comprehensive introduction to the modern study of computer algorithms. It presents many algorithms and covers them in considerable depth, yet makes their design and analysis accessible to all levels of readers.',
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
    description: 'Even bad code can function. But if code is not clean, it can bring a development organization to its knees. Every year, countless hours and significant resources are lost because of poorly written code.',
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
    description: 'A classic American novel about the Jazz Age.',
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
    description: 'A comprehensive physics textbook for science students.',
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
    description: 'Advanced mathematics for college students.',
  },
];

export default function BookDetailClient() {
  const params = useParams();
  const router = useRouter();
  const bookId = params.id as string;

  const book = mockBooks.find((b) => b.id === bookId);

  if (!book) {
    return (
      <Layout allowedRoles={['admin', 'teacher']}>
        <div className="text-center py-12">
          <h1 className="text-2xl font-bold mb-4">Book Not Found</h1>
          <Link href="/library">
            <Button>Back to Library</Button>
          </Link>
        </div>
      </Layout>
    );
  }

  const availabilityPercentage = Math.round((book.availableCopies / book.totalCopies) * 100);

  return (
    <Layout allowedRoles={['admin', 'teacher']}>
      <div className="space-y-6">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="sm" onClick={() => router.back()}>
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back
          </Button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-1">
            <Card>
              <CardContent className="pt-6">
                <div className="aspect-[2/3] w-full mb-4 rounded-lg overflow-hidden border-2 border-border">
                  <img
                    src={book.cover}
                    alt={book.title}
                    className="w-full h-full object-cover"
                  />
                </div>

                <div className="space-y-3">
                  <div className="flex items-center justify-center gap-2 p-3 bg-accent rounded-lg">
                    <Barcode className="w-5 h-5 text-primary" />
                    <span className="font-mono font-semibold text-lg">{book.barcode}</span>
                  </div>

                  <div className="grid grid-cols-2 gap-2">
                    <Button variant="outline" className="w-full">
                      <Edit className="w-4 h-4 mr-2" />
                      Edit
                    </Button>
                    <Button variant="outline" className="w-full text-destructive hover:text-destructive">
                      <Trash2 className="w-4 h-4 mr-2" />
                      Delete
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="lg:col-span-2 space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="text-2xl">{book.title}</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="flex items-start gap-3">
                    <User className="w-5 h-5 text-muted-foreground mt-0.5" />
                    <div>
                      <p className="text-sm text-muted-foreground">Author</p>
                      <p className="font-medium">{book.author}</p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <Building2 className="w-5 h-5 text-muted-foreground mt-0.5" />
                    <div>
                      <p className="text-sm text-muted-foreground">Publisher</p>
                      <p className="font-medium">{book.publisher}</p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <BookOpen className="w-5 h-5 text-muted-foreground mt-0.5" />
                    <div>
                      <p className="text-sm text-muted-foreground">ISBN</p>
                      <p className="font-mono font-medium">{book.isbn}</p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <Calendar className="w-5 h-5 text-muted-foreground mt-0.5" />
                    <div>
                      <p className="text-sm text-muted-foreground">Publish Date</p>
                      <p className="font-medium">{new Date(book.publishDate).toLocaleDateString()}</p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <Tag className="w-5 h-5 text-muted-foreground mt-0.5" />
                    <div>
                      <p className="text-sm text-muted-foreground">Category</p>
                      <Badge variant="outline" className="mt-1">{book.category}</Badge>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <MapPin className="w-5 h-5 text-muted-foreground mt-0.5" />
                    <div>
                      <p className="text-sm text-muted-foreground">Rack Location</p>
                      <Badge variant="secondary" className="mt-1">{book.rackLocation}</Badge>
                    </div>
                  </div>
                </div>

                {book.description && (
                  <div>
                    <h3 className="font-semibold mb-2">Description</h3>
                    <p className="text-muted-foreground leading-relaxed">{book.description}</p>
                  </div>
                )}
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Copy className="w-5 h-5 text-primary" />
                  Availability
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-3 gap-4">
                  <div className="p-4 bg-accent rounded-lg text-center">
                    <p className="text-3xl font-bold text-card-foreground">{book.totalCopies}</p>
                    <p className="text-sm text-muted-foreground mt-1">Total Copies</p>
                  </div>
                  <div className="p-4 bg-green-50 rounded-lg text-center">
                    <p className="text-3xl font-bold text-green-700">{book.availableCopies}</p>
                    <p className="text-sm text-green-600 mt-1">Available</p>
                  </div>
                  <div className="p-4 bg-red-50 rounded-lg text-center">
                    <p className="text-3xl font-bold text-red-700">{book.issuedCopies}</p>
                    <p className="text-sm text-red-600 mt-1">Issued</p>
                  </div>
                </div>

                <div className="mt-6">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium">Availability Rate</span>
                    <span className="text-sm font-bold">{availabilityPercentage}%</span>
                  </div>
                  <div className="w-full bg-accent rounded-full h-3">
                    <div
                      className={`h-3 rounded-full transition-all ${
                        availabilityPercentage > 50
                          ? 'bg-green-600'
                          : availabilityPercentage > 20
                          ? 'bg-amber-600'
                          : 'bg-red-600'
                      }`}
                      style={{ width: `${availabilityPercentage}%` }}
                    />
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </Layout>
  );
}
