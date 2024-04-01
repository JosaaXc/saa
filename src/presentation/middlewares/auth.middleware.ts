import { Request, Response, NextFunction } from "express";
import { JwtAdapter } from "../../config";
import { UserModel } from "../../data";
import { UserEntity } from "../../domain";

export class AuthMiddleware {
    static async validateJWT(req: Request, res: Response, next: NextFunction) {
        const authorization = req.header('Authorization');
        if (!authorization) return res.status(401).json({ error: 'No token provided' });
        if(!authorization.startsWith('Bearer ')) return res.status(401).json({ error: 'Invalid Bearer token' });
        const token = authorization.split(' ').at(1) || '';
        try {

            const payload = await JwtAdapter.validateToken<{ id: string }>(token);
            if(!payload) return res.status(401).json({ error: 'Invalid token' });

            const user = await UserModel.findById(payload.id);
            if(!user) return res.status(401).json({ error: 'User not found' });   

            req.body.user = UserEntity.fromObject(user);
            next();

            //TODO: validar si el usuario está activo

        } catch (error) {
            console.log(error);
            return res.status(500).json({ error: 'Internal Server Error' });
        }
    }

    static async isAdmin(req: Request, res: Response, next: NextFunction) {
        const user = req.body.user;
        if (!user.role.includes('ADMIN_ROLE')) {
            return res.status(403).json({ error: 'User is not an admin' });
        }
        next();
    }
}