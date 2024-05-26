<x-base>
    <div
        id="chat-message"
        data-props="{{ json_encode([
            'userName' => $userName,
            'avatarUrl' => $avatarUrl,
        ])}}">
    </div>
</x-base>
