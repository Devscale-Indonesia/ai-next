"use client";

import { useActionState } from "react";
import { generateStory } from "./action-generate-story";
import Image from "next/image";

export default function Home() {
  const [state, formAction, pending] = useActionState(generateStory, null);

  return (
    <main className="max-w-2xl m-auto py-12 space-y-12">
      <form action={formAction} className="space-y-2">
        <h1>Babystory AI</h1>
        <input name="prompt" placeholder="Generate a story of a deer and a rabbit about thanksgiving" />
        <button disabled={pending}>Generate Story</button>
      </form>

      {state && (
        <div className="space-y-5">
          <Image src={state.coverImage} alt="Cover Image" width={800} height={600} />
          <h2>{state.story.title}</h2>
          <div>
            <h3>Characters</h3>
            {state.story.characters.map((char) => {
              return <div key={char}>{char}</div>;
            })}
          </div>
          <div>
            <h3>Story</h3>
            {state.story.stories.map((story) => {
              return <div key={story}>{story}</div>;
            })}
          </div>
          <div>
            <h3>Moral lessons</h3>
            {state.story.moralLessons.map((lesson) => {
              return <div key={lesson}>{lesson}</div>;
            })}
          </div>
        </div>
      )}
    </main>
  );
}
