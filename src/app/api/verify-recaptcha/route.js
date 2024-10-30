// src/app/api/verify-recaptcha/route.js
export async function POST(request) {
    try {
        const { token } = await request.json();

        const verifyUrl = 'https://www.google.com/recaptcha/api/siteverify';
        const secretKey = process.env.RECAPTCHA_SECRET_KEY;

        const response = await fetch(verifyUrl, {
            method: 'POST',
            headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
            body: `secret=${secretKey}&response=${token}`,
        });

        const data = await response.json();

        // Verifique se a pontuação é aceitável (0.0 a 1.0)
        if (data.success && data.score >= 0.7) {
            return Response.json({ success: true, score: data.score });
        } else {
            return Response.json({
                success: false,
                error: 'Verificação de reCAPTCHA falhou'
            });
        }
    } catch (error) {
        return Response.json({
            success: false,
            error: 'Erro ao verificar reCAPTCHA'
        });
    }
}