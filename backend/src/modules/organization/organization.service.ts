import { OrganizationRepository } from './organization.repository';
import { AppError } from '../../utils/errors';
import { Role } from '@prisma/client';
import bcrypt from 'bcrypt';

export class OrganizationService {
  private repository = new OrganizationRepository();

  async getOrganization(orgId: string) {
    const org = await this.repository.findOrganizationById(orgId);
    if (!org) throw new AppError(404, 'Organization not found');
    return org;
  }

  async updateOrganization(orgId: string, name: string) {
    const org = await this.repository.updateOrganization(orgId, name);
    if (!org) throw new AppError(404, 'Organization not found');
    return org;
  }

  async getMembers(orgId: string, query: { limit?: number, cursor?: string } = {}) {
    const limit = Number(query.limit) || 20;
    const result = await this.repository.getMembers(orgId, limit, query.cursor);
    
    return {
      data: result.items,
      meta: {
        total: result.total,
        limit,
        nextCursor: result.nextCursor,
        hasMore: result.nextCursor !== null
      }
    };
  }

  async inviteMember(orgId: string, email: string, role: Role, password?: string) {
    const existing = await this.repository.findMemberByEmail(email);
    if (existing) {
      throw new AppError(409, 'User with this email already exists');
    }

    if (!password) {
      throw new AppError(400, 'Password is required to invite a member');
    }

    const passwordHash = await bcrypt.hash(password, 12);
    return this.repository.addMember(email, passwordHash, role, orgId);
  }

  async updateMemberRole(targetUserId: string, orgId: string, newRole: Role) {
    const member = await this.repository.findMemberById(targetUserId, orgId);
    if (!member) throw new AppError(404, 'Member not found in your organization');

    // Prevent downgrading the last admin
    if (member.role === 'ADMIN' && newRole !== 'ADMIN') {
      const adminCount = await this.repository.countAdmins(orgId);
      if (adminCount <= 1) {
        throw new AppError(400, 'Cannot downgrade the last admin of the organization');
      }
    }

    return this.repository.updateMemberRole(targetUserId, newRole);
  }

  async removeMember(targetUserId: string, orgId: string, currentUserId: string) {
    if (targetUserId === currentUserId) {
      throw new AppError(400, 'You cannot remove yourself');
    }

    const member = await this.repository.findMemberById(targetUserId, orgId);
    if (!member) throw new AppError(404, 'Member not found in your organization');

    // Prevent removing the last admin
    if (member.role === 'ADMIN') {
      const adminCount = await this.repository.countAdmins(orgId);
      if (adminCount <= 1) {
        throw new AppError(400, 'Cannot remove the last admin of the organization');
      }
    }

    await this.repository.removeMember(targetUserId);
    return { success: true };
  }
}
