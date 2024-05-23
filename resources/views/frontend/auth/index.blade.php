<x-base>
    <div
        id="user-login"
        data-props="{{ json_encode([
            'googleLoginUrl' => route('user.login.google')
        ])}}">
    </div>
</x-base>