import { Injectable, BadRequestException, Body, UnauthorizedException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { parse } from 'csv-parse';
import { promises as fs } from 'fs';
import { User } from 'src/user/entities/user.entity';
import { Repository } from 'typeorm';
import { CreateCooperativeDto } from './dto/create-cooperative.dto';
import { Cooperative } from './entities/cooperative.entity';
import { Role } from 'src/user/entities/roles.enum';
import * as bcrypt from 'bcrypt';

@Injectable()
export class CooperativeService {
    constructor(
        // private readonly inviteService: InviteService, // Inject invite service if used
        @InjectRepository(User)
        private readonly usersRepository: Repository<User>,
        @InjectRepository(Cooperative)
        private readonly cooperativeRepository: Repository<Cooperative>,
    ) {}

    async createCooperative(@Body() createCooperativeDto: CreateCooperativeDto): Promise<Cooperative> {
        // Check if the user (president) already exists
        let president = await this.usersRepository.findOne({where: {email: createCooperativeDto.presidentEmail}});
        
        // If the president does not exist, create them with a default password
        if (!president) {
          const defaultPassword = 'defaultPassword123';  // Change this to a more secure default
          const hashedPassword = await bcrypt.hash(defaultPassword, 10);
    
          president = this.usersRepository.create({
            email: createCooperativeDto.presidentEmail,
            password: hashedPassword,
            role: Role.PRESIDENT,
            isPasswordChanged: false,
          });
    
          await this.usersRepository.save(president);
        }
    
        // Create a new cooperative with this president
        // Create and save the new cooperative
        const cooperative = this.cooperativeRepository.create({
        president,
      });
  
      return this.cooperativeRepository.save(cooperative);
      }

    // Add a new member by email
    // async addMember(cooperativeId: number, email: string): Promise<Member> {
    //     // Validate the email format
    //     if (!this.isValidEmail(email)) {
    //         throw new BadRequestException('Invalid email format');
    //     }

        // const member = new Member();
        // member.email = email;
        // member.cooperativeId = cooperativeId;

        // Save the member to the database
        // Replace with actual save logic
        // return await member.save();
    // }

    // Upload members from a CSV file
    // async uploadMembersFromCsv(cooperativeId: number, filePath: string): Promise<string> {
    //     // const members: Member[] = [];

    //     const fileContent = await fs.readFile(filePath);

    //     return new Promise((resolve, reject) => {
    //         parse(fileContent, {
    //             columns: true,
    //             trim: true,
    //         })
    //         .on('data', async (row) => {
    //             const email = row.email; // Adjust based on your CSV structure
    //             if (this.isValidEmail(email)) {
    //                 const member = new Member();
    //                 member.email = email;
    //                 member.cooperativeId = cooperativeId;
    //                 members.push(member);
    //             }
    //         })
    //         .on('end', async () => {
    //             // Save all valid members to the database
    //             await Promise.all(members.map(member => member.save())); // Replace with actual save logic
    //             resolve('Members added successfully');
    //         })
    //         .on('error', (error) => {
    //             reject(new BadRequestException('Error processing the CSV file'));
    //         });
    //     });
    // }

    // Send invitation to a member
    // async sendInvite(cooperativeId: number, email: string): Promise<void> {
    //     // Validate the email format
    //     if (!this.isValidEmail(email)) {
    //         throw new BadRequestException('Invalid email format');
    //     }

    //     // Logic to send an invitation (using InviteService)
    //     await this.inviteService.sendEmailInvite(email, cooperativeId); // Adjust based on your implementation
    // }

    // // Helper function to validate email
    // private isValidEmail(email: string): boolean {
    //     const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    //     return regex.test(email);
    // }

    // async findOne(){

    // }

    // async save(){
        
    // }
}
