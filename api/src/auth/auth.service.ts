import { Injectable, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcryptjs';
import { User } from 'src/user/shared/user';
import { UserService } from 'src/user/shared/user.service';

@Injectable()
export class AuthService {
    constructor(private userService: UserService, private jwtService: JwtService) { }

    async signIn(username: string, password: string): Promise<any> {
        const user = await this.userService.getByUsername(username);
        if (!user) {
            throw new NotFoundException("User with this username not found");
        }
        let isValidPass = await bcrypt.compare(password, user.password);
        if (!isValidPass) {
            throw new UnauthorizedException();
        }

        const payload = { username: user.username, userId: user._id };

        return {
            ...payload,
            access_token: await this.jwtService.signAsync(payload),
        }
    }

    async profile(userId: string): Promise<User | null> {
        return await this.userService.getById(userId);
    }
}