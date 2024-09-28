import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/app/lib/prisma';
import { getSession } from '@/app/lib/session';
import { CreateJobFormSchema } from '@/app/lib/definitions';

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const id = searchParams.get('id');

  try {
    if (id) {
      const job = await prisma.job.findUnique({
        where: { id: Number(id) },
        select: {
          id: true,
          title: true,
          description: true,
          ownerId: true,
          owner: {
            select: {
              id: true,
              name: true,
              role: true,
            },
          },
        },
      });

      if (!job) {
        return NextResponse.json({ error: 'Job not found' }, { status: 404 });
      }

      return NextResponse.json({ message: 'Job fetched successfully', data: job });
    } else {
      const allJobs = await prisma.job.findMany({
        select: {
          id: true,
          title: true,
          description: true,
          ownerId: true,
          owner: {
            select: {
              id: true,
              name: true,
              role: true,
            },
          },
        },
      });

      return NextResponse.json({ message: 'Jobs fetched successfully', data: allJobs });
    }
  } catch (error) {
    console.error('Error fetching job(s):', error);
    return NextResponse.json({ error: 'Error fetching job(s)' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  const session = await getSession();

  if (!session || session.role !== 'ADMIN') {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const formData = await request.formData()
   
    const validatedFields = CreateJobFormSchema.safeParse({
      title: formData.get('title'),
      description: formData.get('title'),
      ownerId: formData.get('ownerId')
    });
    console.log(validatedFields.data)
    if (!validatedFields.success) {
      return NextResponse.json({ errors: validatedFields.error.flatten().fieldErrors }, { status: 400 });
    }

    const { title, description, ownerId } = validatedFields.data;

    const job = await prisma.job.create({
      data: {
        title,
        description,
        ownerId: Number(ownerId),
        adminId: session.userId,
      },
      select: {
        id: true,
        title: true,
        description: true,
        ownerId: true,
        owner: {
          select: {
            id: true,
            name: true,
            role: true,
          },
        },
      },
    });

    return NextResponse.json({ message: 'Job created successfully', data: job }, { status: 201 });
  } catch (error) {
    console.error('Error creating job:', error);
    return NextResponse.json({ error: 'Error creating job' }, { status: 500 });
  }
}

export async function PUT(request: NextRequest) {
  const session = await getSession();

  if (!session || session.role !== 'ADMIN') {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json({ error: 'Job ID is required' }, { status: 400 });
    }

    const body = await request.json();
    const updatedJob = await prisma.job.update({
      where: { id: Number(id) },
      data: body,
      select: {
        id: true,
        title: true,
        description: true,
        ownerId: true,
        owner: {
          select: {
            id: true,
            name: true,
            role: true,
          },
        },
      },
    });

    return NextResponse.json({ message: 'Job updated successfully', data: updatedJob });
  } catch (error) {
    console.error('Error updating job:', error);
    return NextResponse.json({ error: 'Error updating job' }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest) {
  const session = await getSession();

  if (!session || session.role !== 'ADMIN') {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json({ error: 'Job ID is required' }, { status: 400 });
    }

    await prisma.job.delete({
      where: { id: Number(id) },
    });

    return NextResponse.json({ message: 'Job deleted successfully' });
  } catch (error) {
    console.error('Error deleting job:', error);
    return NextResponse.json({ error: 'Error deleting job' }, { status: 500 });
  }
}
