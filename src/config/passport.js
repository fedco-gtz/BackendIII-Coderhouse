import passport from 'passport';
import { Strategy as JwtStrategy, ExtractJwt } from 'passport-jwt';
import User from '../models/User.js';
import dotenv from 'dotenv';

dotenv.config();

const opts = {
  jwtFromRequest: ExtractJwt.fromExtractors([(req) => req.cookies.token]),
  secretOrKey: process.env.JWT_SECRET,
};

if (!process.env.JWT_SECRET) {
  throw new Error('JWT_SECRET no se encuentra definida en las variabels de entorno');
}

passport.use(
  new JwtStrategy(opts, async (jwt_payload, done) => {
    try {
      const user = await User.findById(jwt_payload.id);
      if (user) {
        return done(null, user);
      }
      return done(null, false);
    } catch (error) {
      return done(error, false);
    }
  })
);

export default passport;
