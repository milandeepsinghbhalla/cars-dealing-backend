
const authentication = (req,res,next)=>{

    const authHeader = req.headers.authorization;

    if (authHeader) {
        const token = authHeader.split(' ')[1]; // Extract token from 'Bearer <token>' format

        jwt.verify(token, secret, (err, decoded) => {
            if (err) {
                return res.status(401).json({ message: 'Unauthorized' });
            }

            req.user = decoded; // Attach decoded user data to the request object
            next();
        });
    } else {
        res.status(401).json({ message: 'Unauthorized' });
    }
}

module.exports =  authentication 