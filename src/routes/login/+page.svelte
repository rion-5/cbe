<script lang="ts">
    import { onMount } from "svelte";
    import { auth } from "../../stores/auth";
    import { login } from "$lib/api/login";
    import type { LoginParam } from "$lib/types/LoginParam";
    import { goto } from "$app/navigation";
    import { page } from "$app/stores";

    let loginId = "";
    let password = "";
    let error: string | null = null;
    let loginIdInput: HTMLInputElement;
    let passwordInput: HTMLInputElement;

    onMount(() => {
        loginIdInput.focus();
    });

    async function handleLogin() {
        if (!loginId) {
            loginIdInput.focus();
            return;
        }
        if (!password) {
            passwordInput.focus();
            return;
        }

        const params: LoginParam = { loginId, password };
        try {
            const result = await login(params);
            console.log(JSON.stringify(result, null, 2));
            if (result.success) {
                auth.set({ isLoggedIn: true, token: result.data.accessToken });
                error = null;
                const target = $page.url.searchParams.get("redirect") || "/";
                goto(target); // 로그인 성공 후 원래 이동하려던 페이지로 리디렉션
            } else {
                error = result.message;
            }
        } catch (err) {
            if (err instanceof Error) {
                error = err.message;
            } else {
                error = "An unknown error occurred";
            }
        }
    }

    function handleKeydown(event: KeyboardEvent) {
        if (event.key === "Enter") {
            handleLogin();
        }
    }
</script>

<div class="login-container">
    <div class="login-box">
        <h2>Login</h2>
        <input
            type="text"
            id="loginid"
            bind:this={loginIdInput}
            bind:value={loginId}
            placeholder="Portal ID"
            on:keydown={handleKeydown}
        />
        <input
            type="password"
            id="password"
            bind:this={passwordInput}
            bind:value={password}
            placeholder="Password"
            on:keydown={handleKeydown}
        />
        <button on:click={handleLogin}>Login</button>
        {#if error}
            <p class="error-message">{error}</p>
        {/if}
    </div>
</div>

<style>
    .login-container {
        display: flex;
        justify-content: center;
        align-items: flex-start;
        height: 100vh;
        background-color: #f0f0f0;
    }
    .login-box {
        margin-top: calc(100vh / 3);
        background: #fff;
        padding: 2rem;
        border-radius: 8px;
        box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
        width: 100%;
        max-width: 400px;
        text-align: center;
    }
    .login-box h2 {
        margin-bottom: 1rem;
        color: #333;
    }
    .login-box input {
        width: 100%;
        padding: 0.5rem;
        margin-bottom: 1rem;
        border: 1px solid #ccc;
        border-radius: 4px;
    }
    .login-box button {
        width: 100%;
        padding: 0.5rem;
        border: none;
        border-radius: 4px;
        background-color: #007bff;
        color: #fff;
        font-size: 1rem;
        cursor: pointer;
    }
    .login-box button:hover {
        background-color: #0056b3;
    }
    .error-message {
        color: red;
        margin-top: 1rem;
    }
    @media (max-width: 600px) {
        .login-box {
            padding: 1rem;
        }
    }
</style>
