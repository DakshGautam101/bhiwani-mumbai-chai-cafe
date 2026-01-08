import jwt from 'jsonwebtoken';


export async function verifyAuth(req) {
  try {
    const authHeader = req.headers.get('authorization');
    if (!authHeader || !authHeader.startsWith('Bearer ')) return null;

    const token = authHeader.split(' ')[1];
    if (!token) return null;

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    console.log("Decoded token:", decoded);
    console.log("User ID from token:", decoded.id);
    return decoded.id; // just the ID
  } catch (err) {
    console.error("Auth error:", err);
    return null;
  }
}
