const bcrypt = require('bcrypt');
const Roles = require('../api/_common/roles');

module.exports = class SeedManager {
  constructor(db ) {
    this.db = db;
  }


  /** server configs */
  async run() {
    try {

           // Seed logic as in the previous example
            await this.db.user.deleteMany();
            await this.db.school.deleteMany();
            await this.db.classroom.deleteMany();
            await this.db.student.deleteMany();

        console.log('Seeding data...');
    
        // Seed Users
        const users = await this.db.user.insertMany([
          {
            username: 'admin1',
            email: 'admin1@school.com',
            password: await bcrypt.hash('password1', 10), 
            role: Roles.SUPER_ADMIN.name,
          },
          {
            username: 'admin2',
            email: 'admin2@school.com',
            password: await bcrypt.hash('password2', 10),
            role: Roles.SCHOOL_ADMIN.name,
          },
        ]);
    
        // Seed Schools
        const schools = await this.db.school.insertMany([
          {
            name: 'North Bridge',
            address: 'Kampala, Uganda',
            email: 'admin@northbridge.ac.ug',
            isActive: true,
            createdBy: users[0]._id,
          },
          {
            name: 'East Valley',
            address: 'Nairobi, Kenya',
            email: 'admin@eastvalley.ac.ke',
            isActive: true,
            createdBy: users[0]._id,
          },
        ]);
    
        // Seed Classrooms
        const classrooms = await this.db.classroom.insertMany([
          {
            name: 'Math Classroom',
            capacity: 30,
            school: schools[0]._id,
            createdBy: users[1]._id,
          },
          {
            name: 'Science Lab',
            capacity: 25,
            school: schools[1]._id,
            createdBy: users[1]._id,
          },
        ]);
    
        // Seed Students
        await this.db.student.insertMany([
          {
            authProfile: users[1]._id,
            firstName: 'John',
            lastName: 'Doe',
            dateOfBirth: new Date('2005-06-15'),
            enrollmentDate: new Date(),
            isActive: true,
            school: schools[0]._id,
            classrooms: [classrooms[0]._id],
            createdBy: users[1]._id,
          },
          {
            authProfile: users[1]._id,
            firstName: 'Jane',
            lastName: 'Smith',
            dateOfBirth: new Date('2007-09-21'),
            enrollmentDate: new Date(),
            isActive: true,
            school: schools[1]._id,
            classrooms: [classrooms[1]._id],
            createdBy: users[1]._id,
          },
        ]);
    
        console.log('Data seeding completed successfully!');
      } catch (err) {
        console.error('Error while seeding data:', err);
      }
 }
};
