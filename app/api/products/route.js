import { NextResponse } from 'next/server';
import { getPool } from '@/lib/db';

// GET /api/products -> list all products
export async function GET() {
  try {
    const pool = getPool();
    const [rows] = await pool.query(
      'SELECT id, name, category, description, price, created_at FROM products ORDER BY id DESC'
    );
    return NextResponse.json(rows);
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

// POST /api/products -> create a new product
export async function POST(request) {
  try {
    const body = await request.json();
    const { name, description, price } = body;
    const category =
      typeof body.category === 'string' ? body.category.trim() : '';

    if (category.length > 100) {
      return NextResponse.json(
        { error: 'Kategori maksimal 100 karakter' },
        { status: 400 }
      );
    }

    if (!name || price === undefined || price === '') {
      return NextResponse.json(
        { error: 'Field "name" and "price" wajib diisi' },
        { status: 400 }
      );
    }

    const pool = getPool();
    const [result] = await pool.query(
      'INSERT INTO products (name, category, description, price) VALUES (?, ?, ?, ?)',
      [name, category || null, description || null, price]
    );

    return NextResponse.json(
      { id: result.insertId, name, category: category || null, description, price },
      { status: 201 }
    );
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
