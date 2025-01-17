export default function PhoneVerification() {
  return (
    <div>
      <section>
        <h1 className="text-2xl   mb-4">Updating your email address</h1>
        <div className="space-y-4">
          <h2 className="text-xl font-semibold">Important Note</h2>
          <div className="bg-yellow-50 dark:bg-yellow-950/30 border border-yellow-200 dark:border-yellow-900 rounded-lg p-4">
            <p className="text-yellow-800 dark:text-yellow-200">
              You can only change your email address if your account uses email
              and password for authentication. If you signed up using Google,
              Facebook, Apple, or another OAuth provider, your email is managed
              by that provider.
            </p>
          </div>
        </div>
      </section>
      {/* steps */}
      <div className="space-y-4">
        <h2 className="text-xl font-semibold">Steps to Update Your Email:</h2>
        <ol className="ml-4 space-y-2 ">
          <li>1. Log in to your account</li>
          <li>2. Navigate to Account Settings</li>
          <li>3. Select "Change Email Address"</li>
          <li>4. Enter your new email address</li>
          <li>5. Verify your password</li>
          <li>6. Click "Save" or "Update"</li>
          <li>7. Check your new email for confirmation</li>
          <li>8. Click the verification link</li>
        </ol>
      </div>
      {/* Oaauth */}

      <div className="space-y-4">
        <h2 className="text-xl font-semibold">For OAuth Users:</h2>
        <ul className="ml-4 space-y-2 text-muted-foreground">
          <li>Log in to your provider account (Google)</li>
          <li>Update your email in their settings</li>
          <li> Changes will sync automatically on next login</li>
        </ul>
      </div>
    </div>
  );
}
