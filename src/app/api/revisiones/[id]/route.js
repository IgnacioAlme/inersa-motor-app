import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function DELETE(request, { params }) {
  try {
    const { id } = params;
    await prisma.revision.delete({
      where: { id: parseInt(id) },
    });
    return NextResponse.json({ message: 'Revision deleted successfully' });
  } catch (error) {
    console.error('Error deleting revision:', error);
    return NextResponse.json({ error: 'Error deleting revision' }, { status: 500 });
  }
}