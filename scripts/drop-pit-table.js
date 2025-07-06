const { PrismaClient } = require('../src/generated/prisma');

const prisma = new PrismaClient();

async function dropPitTable() {
  try {
    console.log('Dropping Pit table and related data...');

    // First, delete all PitFile records (they reference Pit)
    const deletedFiles = await prisma.pitFile.deleteMany({});
    console.log(`Deleted ${deletedFiles.count} PitFile records`);

    // Then delete all Pit records
    const deletedPits = await prisma.pit.deleteMany({});
    console.log(`Deleted ${deletedPits.count} Pit records`);

    console.log('Pit table has been cleared successfully!');
    console.log('You can now run the sync-filesystem API to recreate the data from the file system.');
    
  } catch (error) {
    console.error('Error dropping Pit table:', error);
  } finally {
    await prisma.$disconnect();
  }
}

dropPitTable(); 