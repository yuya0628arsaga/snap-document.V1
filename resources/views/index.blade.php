<!doctype html>
<html lang="ja">

<head>
    <meta charset="utf-8">
    <title>{{ 'タイトル' }} | {{ env('APP_NAME') }}</title>
    <meta name="description" content="">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <meta name="csrf-token" content="{{ csrf_token() }}">
    <link rel="shortcut icon" sizes="32x32" href="{{ asset('/images/favicon-32x32.ico') }}" type="image/x-icon">
    @viteReactRefresh
    @vite(['resources/sass/app.scss', 'resources/ts/app.tsx'])
</head>

<body>
    <div id="test">test</div>
    <div
        id="example-id"
        data-props="{{ json_encode([
        ])}}">
    </div>

</body>

</html>
