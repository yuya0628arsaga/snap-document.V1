<x-base>
    <div
        id="user-login"
        data-props="{{ json_encode([
            'googleLoginUrl' => route('user.login.google'),
            'appName' => config('app.name'),
        ])}}">
    </div>
</x-base>