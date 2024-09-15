<!--
// v0 by Vercel.
// https://v0.dev/t/AfXYpLG
-->
<script lang="ts">
  import { error } from "@sveltejs/kit";
  import { onMount } from "svelte";
  import DepartmentStudentBarChart from "./DepartmentStudentBarChart.svelte";

  interface Academic {
    department: string;
    nationality: string;
    academicstatus: string;
    term: string;
  }
  interface DepartmentStudentCounts {
    department: string;
    count: number;
  }

  let academicList: Academic[] = [];

  let studentCount: DepartmentStudentCounts[] = [];

  onMount(async () => {
    const response = await fetch("/api/academic?term=202402");
    if (!response.ok) {
      throw new Error("Failed to fetch data");
    }

    academicList = await response.json();

    studentCount = academicList
      .filter((students) => students.academicstatus === "재학생") // 필터링
      .reduce((acc, students) => {
        const existingDepartment = acc.find(
          (item) => item.department === students.department,
        );
        if (existingDepartment) {
          existingDepartment.count++;
        } else {
          acc.push({ department: students.department, count: 1 });
        }
        return acc;
      }, [] as DepartmentStudentCounts[]);
  });
</script>

<section class="w-full">
  <main class="container mx-auto px-4 md:px-6 py-8">
    <section class="mb-8">
      <h2 class="text-2xl font-bold mb-4">Top Story</h2>
      <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <DepartmentStudentBarChart {studentCount} />
        </div>
        <div class="flex flex-col justify-center">
          <h3 class="text-xl font-bold mb-2">Top Story Headline</h3>
          <p class="text-zinc-500 dark:text-zinc-400">
            This is a brief summary of the top story. Click the link to read
            more.
          </p>
          <a class="text-blue-500 hover:text-blue-700 mt-4" href="/">
            Read More
          </a>
          {#each studentCount as item}
            <li>학과: {item.department}</li>
          {/each}
        </div>
      </div>
    </section>
    <section class="mb-8">
      <h2 class="text-2xl font-bold mb-4">Politics</h2>
      <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div>
          <img
            alt="Politics Story"
            class="w-full h-64 object-cover object-center rounded-lg"
            height="400"
            src="/placeholder.svg"
            width="600"
            style="aspect-ratio:600/400;object-fit:cover"
          />
          <h3 class="text-xl font-bold mb-2 mt-4">Politics Story Headline</h3>
          <p class="text-zinc-500 dark:text-zinc-400">
            This is a brief summary of the politics story. Click the link to
            read more.
          </p>
          <a class="text-blue-500 hover:text-blue-700 mt-4" href="/">
            Read More
          </a>
        </div>
        <div>
          <img
            alt="Politics Story"
            class="w-full h-64 object-cover object-center rounded-lg"
            height="400"
            src="/placeholder.svg"
            width="600"
            style="aspect-ratio:600/400;object-fit:cover"
          />
          <h3 class="text-xl font-bold mb-2 mt-4">Politics Story Headline</h3>
          <p class="text-zinc-500 dark:text-zinc-400">
            This is a brief summary of the politics story. Click the link to
            read more.
          </p>
          <a class="text-blue-500 hover:text-blue-700 mt-4" href="/">
            Read More
          </a>
        </div>
        <div>
          <img
            alt="Politics Story"
            class="w-full h-64 object-cover object-center rounded-lg"
            height="400"
            src="/placeholder.svg"
            width="600"
            style="aspect-ratio:600/400;object-fit:cover"
          />
          <h3 class="text-xl font-bold mb-2 mt-4">Politics Story Headline</h3>
          <p class="text-zinc-500 dark:text-zinc-400">
            This is a brief summary of the politics story. Click the link to
            read more.
          </p>
          <a class="text-blue-500 hover:text-blue-700 mt-4" href="/">
            Read More
          </a>
        </div>
      </div>
    </section>
    <section class="mb-8">
      <h2 class="text-2xl font-bold mb-4">Business</h2>
      <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div>
          <img
            alt="Business Story"
            class="w-full h-64 object-cover object-center rounded-lg"
            height="400"
            src="/placeholder.svg"
            width="600"
            style="aspect-ratio:600/400;object-fit:cover"
          />
          <h3 class="text-xl font-bold mb-2 mt-4">Business Story Headline</h3>
          <p class="text-zinc-500 dark:text-zinc-400">
            This is a brief summary of the business story. Click the link to
            read more.
          </p>
          <a class="text-blue-500 hover:text-blue-700 mt-4" href="/">
            Read More
          </a>
        </div>
        <div>
          <img
            alt="Business Story"
            class="w-full h-64 object-cover object-center rounded-lg"
            height="400"
            src="/placeholder.svg"
            width="600"
            style="aspect-ratio:600/400;object-fit:cover"
          />
          <h3 class="text-xl font-bold mb-2 mt-4">Business Story Headline</h3>
          <p class="text-zinc-500 dark:text-zinc-400">
            This is a brief summary of the business story. Click the link to
            read more.
          </p>
          <a class="text-blue-500 hover:text-blue-700 mt-4" href="/">
            Read More
          </a>
        </div>
        <div>
          <img
            alt="Business Story"
            class="w-full h-64 object-cover object-center rounded-lg"
            height="400"
            src="/placeholder.svg"
            width="600"
            style="aspect-ratio:600/400;object-fit:cover"
          />
          <h3 class="text-xl font-bold mb-2 mt-4">Business Story Headline</h3>
          <p class="text-zinc-500 dark:text-zinc-400">
            This is a brief summary of the business story. Click the link to
            read more.
          </p>
          <a class="text-blue-500 hover:text-blue-700 mt-4" href="/">
            Read More
          </a>
        </div>
      </div>
    </section>
    <section class="mb-8">
      <h2 class="text-2xl font-bold mb-4">Tech</h2>
      <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div>
          <img
            alt="Tech Story"
            class="w-full h-64 object-cover object-center rounded-lg"
            height="400"
            src="/placeholder.svg"
            width="600"
            style="aspect-ratio:600/400;object-fit:cover"
          />
          <h3 class="text-xl font-bold mb-2 mt-4">Tech Story Headline</h3>
          <p class="text-zinc-500 dark:text-zinc-400">
            This is a brief summary of the tech story. Click the link to read
            more.
          </p>
          <a class="text-blue-500 hover:text-blue-700 mt-4" href="/">
            Read More
          </a>
        </div>
        <div>
          <img
            alt="Tech Story"
            class="w-full h-64 object-cover object-center rounded-lg"
            height="400"
            src="/placeholder.svg"
            width="600"
            style="aspect-ratio:600/400;object-fit:cover"
          />
          <h3 class="text-xl font-bold mb-2 mt-4">Tech Story Headline</h3>
          <p class="text-zinc-500 dark:text-zinc-400">
            This is a brief summary of the tech story. Click the link to read
            more.
          </p>
          <a class="text-blue-500 hover:text-blue-700 mt-4" href="/">
            Read More
          </a>
        </div>
        <div>
          <img
            alt="Tech Story"
            class="w-full h-64 object-cover object-center rounded-lg"
            height="400"
            src="/placeholder.svg"
            width="600"
            style="aspect-ratio:600/400;object-fit:cover"
          />
          <h3 class="text-xl font-bold mb-2 mt-4">Tech Story Headline</h3>
          <p class="text-zinc-500 dark:text-zinc-400">
            This is a brief summary of the tech story. Click the link to read
            more.
          </p>
          <a class="text-blue-500 hover:text-blue-700 mt-4" href="/">
            Read More
          </a>
        </div>
      </div>
    </section>
    <section class="mb-8">
      <h2 class="text-2xl font-bold mb-4">Culture</h2>
      <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div>
          <img
            alt="Culture Story"
            class="w-full h-64 object-cover object-center rounded-lg"
            height="400"
            src="/placeholder.svg"
            width="600"
            style="aspect-ratio:600/400;object-fit:cover"
          />
          <h3 class="text-xl font-bold mb-2 mt-4">Culture Story Headline</h3>
          <p class="text-zinc-500 dark:text-zinc-400">
            This is a brief summary of the culture story. Click the link to read
            more.
          </p>
          <a class="text-blue-500 hover:text-blue-700 mt-4" href="/">
            Read More
          </a>
        </div>
        <div>
          <img
            alt="Culture Story"
            class="w-full h-64 object-cover object-center rounded-lg"
            height="400"
            src="/placeholder.svg"
            width="600"
            style="aspect-ratio:600/400;object-fit:cover"
          />
          <h3 class="text-xl font-bold mb-2 mt-4">Culture Story Headline</h3>
          <p class="text-zinc-500 dark:text-zinc-400">
            This is a brief summary of the culture story. Click the link to read
            more.
          </p>
          <a class="text-blue-500 hover:text-blue-700 mt-4" href="/">
            Read More
          </a>
        </div>
        <div>
          <img
            alt="Culture Story"
            class="w-full h-64 object-cover object-center rounded-lg"
            height="400"
            src="/placeholder.svg"
            width="600"
            style="aspect-ratio:600/400;object-fit:cover"
          />
          <h3 class="text-xl font-bold mb-2 mt-4">Culture Story Headline</h3>
          <p class="text-zinc-500 dark:text-zinc-400">
            This is a brief summary of the culture story. Click the link to read
            more.
          </p>
          <a class="text-blue-500 hover:text-blue-700 mt-4" href="/">
            Read More
          </a>
        </div>
      </div>
    </section>
    <section class="mb-8">
      <h2 class="text-2xl font-bold mb-4">Sports</h2>
      <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div>
          <img
            alt="Sports Story"
            class="w-full h-64 object-cover object-center rounded-lg"
            height="400"
            src="/placeholder.svg"
            width="600"
            style="aspect-ratio:600/400;object-fit:cover"
          />
          <h3 class="text-xl font-bold mb-2 mt-4">Sports Story Headline</h3>
          <p class="text-zinc-500 dark:text-zinc-400">
            This is a brief summary of the sports story. Click the link to read
            more.
          </p>
          <a class="text-blue-500 hover:text-blue-700 mt-4" href="/">
            Read More
          </a>
        </div>
        <div>
          <img
            alt="Sports Story"
            class="w-full h-64 object-cover object-center rounded-lg"
            height="400"
            src="/placeholder.svg"
            width="600"
            style="aspect-ratio:600/400;object-fit:cover"
          />
          <h3 class="text-xl font-bold mb-2 mt-4">Sports Story Headline</h3>
          <p class="text-zinc-500 dark:text-zinc-400">
            This is a brief summary of the sports story. Click the link to read
            more.
          </p>
          <a class="text-blue-500 hover:text-blue-700 mt-4" href="/">
            Read More
          </a>
        </div>
        <div>
          <img
            alt="Sports Story"
            class="w-full h-64 object-cover object-center rounded-lg"
            height="400"
            src="/placeholder.svg"
            width="600"
            style="aspect-ratio:600/400;object-fit:cover"
          />
          <h3 class="text-xl font-bold mb-2 mt-4">Sports Story Headline</h3>
          <p class="text-zinc-500 dark:text-zinc-400">
            This is a brief summary of the sports story. Click the link to read
            more.
          </p>
          <a class="text-blue-500 hover:text-blue-700 mt-4" href="/">
            Read More
          </a>
        </div>
      </div>
    </section>
  </main>
</section>
