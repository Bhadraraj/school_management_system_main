import { NextRequest, NextResponse } from 'next/server';
import { schoolsApi } from '@/lib/api/multi-school';
import { supabase } from '@/lib/supabase';

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const schoolId = searchParams.get('school_id');

    if (schoolId) {
      const school = await schoolsApi.getById(schoolId);
      return NextResponse.json(school);
    } else {
      const schools = await schoolsApi.getAll();
      return NextResponse.json(schools);
    }
  } catch (error) {
    console.error('Error fetching schools:', error);
    return NextResponse.json({ error: 'Failed to fetch schools' }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    
    // Validate required fields
    if (!body.name || !body.email) {
      return NextResponse.json({ error: 'Name and email are required' }, { status: 400 });
    }

    const school = await schoolsApi.create({
      name: body.name,
      email: body.email,
      phone: body.phone,
      address: body.address,
      website: body.website,
      timezone: body.timezone || 'UTC',
      currency: body.currency || 'USD',
    });

    return NextResponse.json(school, { status: 201 });
  } catch (error) {
    console.error('Error creating school:', error);
    return NextResponse.json({ error: 'Failed to create school' }, { status: 500 });
  }
}

export async function PUT(req: NextRequest) {
  try {
    const body = await req.json();
    const { id, ...updates } = body;

    if (!id) {
      return NextResponse.json({ error: 'School ID is required' }, { status: 400 });
    }

    const school = await schoolsApi.update(id, updates);
    return NextResponse.json(school);
  } catch (error) {
    console.error('Error updating school:', error);
    return NextResponse.json({ error: 'Failed to update school' }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const schoolId = searchParams.get('school_id');

    if (!schoolId) {
      return NextResponse.json({ error: 'School ID is required' }, { status: 400 });
    }

    await schoolsApi.delete(schoolId);
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error deleting school:', error);
    return NextResponse.json({ error: 'Failed to delete school' }, { status: 500 });
  }
}