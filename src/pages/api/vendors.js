import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export default async function handler(req, res) {
  switch (req.method) {
    case 'POST':
      return createVendor(req, res);
    case 'GET':
      return getVendors(req, res);
    case 'DELETE':
      return deleteVendor(req, res);
    case 'PUT':
      return updateVendor(req, res);
    default:
      return res.status(405).json({ message: 'Method not allowed' });
  }
}

async function createVendor(req, res) {
  const { name, contact, services } = req.body;

  if (!name || !contact || !services) {
    return res.status(400).json({ message: 'Name, contact, and services are required' });
  }

  try {
    const vendor = await prisma.vendor.create({
      data: {
        name,
        contact,
        services,
      },
    });

    return res.status(201).json({ message: 'Vendor created', vendor });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: 'Internal server error' });
  }
}

async function getVendors(req, res) {
  try {
    const vendors = await prisma.vendor.findMany();
    return res.status(200).json(vendors);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: 'Internal server error' });
  }
}

async function deleteVendor(req, res) {
  const { id } = req.body;

  if (!id) {
    return res.status(400).json({ message: 'Vendor ID is required' });
  }

  try {
    await prisma.vendor.delete({
      where: { id },
    });

    return res.status(200).json({ message: 'Vendor deleted' });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: 'Internal server error' });
  }
}

async function updateVendor(req, res) {
  const { id, name, contact, services } = req.body;

  if (!id || !name || !contact || !services) {
    return res.status(400).json({ message: 'ID, name, contact, and services are required' });
  }

  try {
    const vendor = await prisma.vendor.update({
      where: { id },
      data: {
        name,
        contact,
        services,
      },
    });

    return res.status(200).json({ message: 'Vendor updated', vendor });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: 'Internal server error' });
  }
}
