import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcrypt';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Starting database seeding...');

  // Create Hospital
  const hospital = await prisma.hospital.upsert({
    where: { id: 'hospital-1' },
    update: {},
    create: {
      id: 'hospital-1',
      name: 'CUREX Demo Hospital',
      type: 'MULTISPECIALTY',
      address: 'Demo Address',
      city: 'Mumbai',
      state: 'Maharashtra',
      pincode: '400001',
      phone: '+91-22-12345678',
    },
  });
  console.log('✅ Hospital created:', hospital.name);

  // Create Admin User
  const adminPassword = await bcrypt.hash('admin123', 10);
  const adminUser = await prisma.user.upsert({
    where: { email: 'admin@curex.demo' },
    update: {},
    create: {
      id: 'user-admin-1',
      email: 'admin@curex.demo',
      password: adminPassword,
      role: 'ADMIN',
    },
  });

  await prisma.admin.upsert({
    where: { userId: adminUser.id },
    update: {},
    create: {
      userId: adminUser.id,
      hospitalId: hospital.id,
      firstName: 'Admin',
      lastName: 'User',
      role: 'SYSTEM_ADMIN',
    },
  });
  console.log('✅ Admin user created: admin@curex.demo / admin123');

  // Create Doctor User
  const doctorPassword = await bcrypt.hash('doctor123', 10);
  const doctorUser = await prisma.user.upsert({
    where: { email: 'doctor@curex.demo' },
    update: {},
    create: {
      id: 'user-doctor-1',
      email: 'doctor@curex.demo',
      password: doctorPassword,
      role: 'DOCTOR',
    },
  });

  await prisma.doctor.upsert({
    where: { userId: doctorUser.id },
    update: {},
    create: {
      userId: doctorUser.id,
      hospitalId: hospital.id,
      firstName: 'Dr. Rajesh',
      lastName: 'Kumar',
      qualification: 'MBBS, MD',
      specialization: 'General Medicine',
      licenseNumber: 'DOC-2024-001',
    },
  });
  console.log('✅ Doctor user created: doctor@curex.demo / doctor123');

  // Create Patient User
  const patientPassword = await bcrypt.hash('patient123', 10);
  const patientUser = await prisma.user.upsert({
    where: { email: 'patient@curex.demo' },
    update: {},
    create: {
      id: 'user-patient-1',
      email: 'patient@curex.demo',
      password: patientPassword,
      role: 'PATIENT',
    },
  });

  const patient = await prisma.patient.upsert({
    where: { userId: patientUser.id },
    update: {},
    create: {
      userId: patientUser.id,
      firstName: 'Rahul',
      lastName: 'Sharma',
      dateOfBirth: new Date('1982-05-15'),
      gender: 'MALE',
      phone: '+91-9876543210',
      city: 'Mumbai',
      state: 'Maharashtra',
      bloodGroup: 'O+',
    },
  });
  console.log('✅ Patient user created: patient@curex.demo / patient123');

  // Create Medical History for patient
  await prisma.medicalHistory.upsert({
    where: { patientId: patient.id },
    update: {},
    create: {
      patientId: patient.id,
    },
  });

  // Create Kiosk
  await prisma.kiosk.upsert({
    where: { deviceId: 'kiosk-001' },
    update: {},
    create: {
      hospitalId: hospital.id,
      name: 'Triage Station #04',
      location: 'Ground Floor - OPD Entrance',
      deviceId: 'kiosk-001',
      isOnline: true,
      lastPing: new Date(),
    },
  });
  console.log('✅ Kiosk created');

  // Create Question Bank
  const questions = [
    {
      category: 'CHEST_PAIN',
      questionText: 'Where exactly do you feel the chest pain?',
      answerType: 'TEXT',
    },
    {
      category: 'CHEST_PAIN',
      questionText: 'When did the chest pain start?',
      answerType: 'TEXT',
    },
    {
      category: 'CHEST_PAIN',
      questionText: 'Do you have difficulty breathing?',
      answerType: 'YES_NO',
    },
    {
      category: 'CHEST_PAIN',
      questionText: 'Are you experiencing sweating?',
      answerType: 'YES_NO',
    },
    {
      category: 'FEVER',
      questionText: 'How many days have you had fever?',
      answerType: 'NUMBER',
    },
    {
      category: 'FEVER',
      questionText: 'What is your temperature?',
      answerType: 'NUMBER',
    },
  ];

  for (const q of questions) {
    await prisma.questionBank.upsert({
      where: {
        id: `question-${q.category}-${q.questionText.slice(0, 20).replace(/\s+/g, '-')}`,
      },
      update: {},
      create: {
        id: `question-${q.category}-${q.questionText.slice(0, 20).replace(/\s+/g, '-')}`,
        ...q,
      },
    });
  }
  console.log('✅ Question bank populated');

  // Create Red Flag Rules
  await prisma.redFlagRule.upsert({
    where: { name: 'CHEST_PAIN_EMERGENCY' },
    update: {},
    create: {
      name: 'CHEST_PAIN_EMERGENCY',
      description: 'Chest pain with breathing difficulty and sweating',
      severity: 'URGENT',
    },
  });

  await prisma.redFlagRule.upsert({
    where: { name: 'HIGH_FEVER' },
    update: {},
    create: {
      name: 'HIGH_FEVER',
      description: 'Temperature above 103°F (39.4°C)',
      severity: 'HIGH',
    },
  });
  console.log('✅ Red flag rules created');

  console.log('\n🎉 Database seeding completed successfully!');
  console.log('\n📋 Demo Credentials:');
  console.log('   Admin:   admin@curex.demo / admin123');
  console.log('   Doctor:  doctor@curex.demo / doctor123');
  console.log('   Patient: patient@curex.demo / patient123');
}

main()
  .catch((e) => {
    console.error('❌ Error seeding database:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
