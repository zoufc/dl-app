# Guide d'utilisation du service Mail

## Configuration

### Variables d'environnement à ajouter dans `.env`

```env
# Configuration Mail
MAIL_HOST=smtp.gmail.com
MAIL_PORT=587
MAIL_SECURE=false
MAIL_USER=votre-email@gmail.com
MAIL_PASSWORD=votre-mot-de-passe-application
MAIL_FROM="Nom de l'expéditeur <votre-email@gmail.com>"
```

### Exemples de configuration selon le fournisseur

**Gmail :**

```env
MAIL_HOST=smtp.gmail.com
MAIL_PORT=587
MAIL_SECURE=false
MAIL_USER=votre-email@gmail.com
MAIL_PASSWORD=votre-mot-de-passe-application
MAIL_FROM="Votre Nom <votre-email@gmail.com>"
```

**Outlook/Office 365 :**

```env
MAIL_HOST=smtp.office365.com
MAIL_PORT=587
MAIL_SECURE=false
MAIL_USER=votre-email@outlook.com
MAIL_PASSWORD=votre-mot-de-passe
MAIL_FROM="Votre Nom <votre-email@outlook.com>"
```

## Utilisation dans un service

### 1. Injecter le MailService

```typescript
import { Injectable } from '@nestjs/common';
import { MailService } from 'src/providers/mail-service/mail.service';

@Injectable()
export class MonService {
  constructor(private mailService: MailService) {}

  async maMethode() {
    // Utiliser le service mail
  }
}
```

### 2. Envoyer un email simple

```typescript
await this.mailService.sendMail({
  to: 'destinataire@example.com',
  subject: "Sujet de l'email",
  html: '<h1>Contenu HTML</h1><p>Message en HTML</p>',
  text: 'Contenu texte (alternative)',
});
```

### 3. Envoyer un email avec plusieurs destinataires

```typescript
await this.mailService.sendMail({
  to: ['destinataire1@example.com', 'destinataire2@example.com'],
  cc: 'copie@example.com',
  bcc: 'copie-cachee@example.com',
  subject: 'Email à plusieurs destinataires',
  html: '<p>Message</p>',
});
```

### 4. Envoyer un email avec pièces jointes

```typescript
await this.mailService.sendMail({
  to: 'destinataire@example.com',
  subject: 'Email avec pièce jointe',
  html: '<p>Voir la pièce jointe</p>',
  attachments: [
    {
      filename: 'document.pdf',
      path: '/chemin/vers/document.pdf',
    },
    {
      filename: 'image.jpg',
      content: Buffer.from('...'), // Contenu en buffer
      contentType: 'image/jpeg',
    },
  ],
});
```

### 5. Utiliser les méthodes prédéfinies

#### Email de bienvenue

```typescript
await this.mailService.sendWelcomeEmail(
  'nouvel-utilisateur@example.com',
  'Jean Dupont',
  '123456', // mot de passe temporaire (optionnel)
);
```

#### Email de réinitialisation de mot de passe

```typescript
const resetToken = 'token-secret-123';
const resetUrl = `https://votre-site.com/reset-password?token=${resetToken}`;

await this.mailService.sendPasswordResetEmail(
  'utilisateur@example.com',
  'Jean Dupont',
  resetToken,
  resetUrl,
);
```

## Endpoints de test disponibles

### 1. Vérifier la connexion au serveur mail

```bash
GET /mail/verify
```

**Réponse :**

```json
{
  "message": "Connexion au serveur mail réussie",
  "connected": true
}
```

### 2. Envoyer un email de test

```bash
POST /mail/test
Content-Type: application/json

{
  "to": "destinataire@example.com",
  "subject": "Test d'email",
  "html": "<h1>Test</h1><p>Ceci est un test</p>",
  "text": "Test - Ceci est un test"
}
```

### 3. Envoyer un email de bienvenue

```bash
POST /mail/welcome
Content-Type: application/json

{
  "to": "nouvel-utilisateur@example.com",
  "name": "Jean Dupont",
  "password": "123456"
}
```

### 4. Envoyer un email de réinitialisation

```bash
POST /mail/password-reset
Content-Type: application/json

{
  "to": "utilisateur@example.com",
  "name": "Jean Dupont",
  "resetToken": "token-secret-123",
  "resetUrl": "https://votre-site.com/reset-password?token=token-secret-123"
}
```

## Exemple d'intégration dans UserService

```typescript
import { MailService } from 'src/providers/mail-service/mail.service';

@Injectable()
export class UserService {
  constructor(
    @InjectModel('User') private userModel: Model<User>,
    private mailService: MailService, // Injection du service mail
  ) {}

  async create(createUserDto: CreateUserDto) {
    try {
      const user = new this.userModel(createUserDto);
      const password = '123456';
      user.password = password;
      await user.save();

      // Envoyer un email de bienvenue
      try {
        await this.mailService.sendWelcomeEmail(
          user.email,
          `${user.firstname} ${user.lastname}`,
          password,
        );
      } catch (mailError) {
        logger.error(`Erreur envoi email bienvenue: ${mailError.message}`);
        // Ne pas faire échouer la création de l'utilisateur si l'email échoue
      }

      return sanitizeUser(user);
    } catch (error) {
      throw new HttpException(error.message, error.status);
    }
  }
}
```

## Notes importantes

1. **Installation de nodemailer** : Assurez-vous que `nodemailer` est installé :

   ```bash
   npm install nodemailer @types/nodemailer
   ```

2. **Gestion des erreurs** : Les erreurs d'envoi d'email sont loggées mais ne doivent pas faire échouer les opérations principales (création d'utilisateur, etc.)

3. **Sécurité** : Pour Gmail, utilisez un "Mot de passe d'application" et non votre mot de passe principal

4. **Module Global** : Le `MailModule` est déclaré comme `@Global()`, donc vous pouvez l'injecter dans n'importe quel service sans l'importer dans le module
