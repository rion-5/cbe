<script lang="ts">
    import { auth } from "../stores/auth";
    import { goto } from "$app/navigation";
    import { page } from "$app/stores";
    import "../app.css";

    let isLoggedIn: boolean;
    let isMenuOpen = false;

    // 로그인 상태 구독
    $: auth.subscribe((state) => {
        isLoggedIn = state.isLoggedIn;
    });

    // 보호된 경로 목록
    const protectedRoutes = ["/facultyAffairs","/academicAffairs","/scholarship", "/lecture"];
    // const protectedRoutes = [];

    // 페이지 이동 시 로그인 상태 확인
    $: page.subscribe(($page) => {
        // console.log($page.url.pathname);
        if (protectedRoutes.includes($page.url.pathname) && !isLoggedIn) {
            goto(`/login?redirect=${$page.url.pathname}`);
        }
    });

    function toggleMenu() {
        isMenuOpen = !isMenuOpen;
    }

    function menu_close() {
        isMenuOpen = false;
    }
    function handleLogout() {
        auth.set({ isLoggedIn: false });
        if (isMenuOpen) {
            isMenuOpen = false;
        }
        goto("/login");
    }
</script>

<nav>
    <header class="bg-white text-zinc-900 py-4 border-b">
        <div class="container mx-auto px-4 md:px-6">
            <nav class="flex items-center justify-between">
                <div class="text-2xl font-bold">HYU CBE</div>
                <div class:menu-open={isMenuOpen} class="space-x-4">
                    <a
                        class="text-zinc-900 hover:text-zinc-700"
                        href="/"
                        on:click={() => menu_close()}>Home</a
                    >
                    <a
                        class="text-zinc-900 hover:text-zinc-700"
                        href="/facultyAffairs"
                        on:click={() => menu_close()}>Faculty</a
                    >
                    <a
                        class="text-zinc-900 hover:text-zinc-700"
                        href="/academicAffairs"
                        on:click={() => menu_close()}>Academic</a
                    >
                    <a
                        class="text-zinc-900 hover:text-zinc-700"
                        href="/lecture"
                    >
                        Lecture
                    </a>
                    <a
                        class="text-zinc-900 hover:text-zinc-700"
                        href="/scholarship">Scholarship</a
                    >
                    {#if isLoggedIn}
                        <button type="button" on:click={handleLogout}
                            >Logout</button
                        >
                    {:else}
                        <a href="/login" on:click={() => menu_close()}>Login</a>
                    {/if}
                </div>
            </nav>
        </div>
    </header>
</nav>

<slot></slot>
