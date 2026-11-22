import React from "react";
import { Composition, Folder } from "remotion";
import { UDVideo, SceneView } from "./UDVideo";
import { STORYBOARDS } from "./storyboards";
import { FPS, totalFrames } from "./storyboard/timeline";
import type { Storyboard } from "./storyboard/types";

const dims = (sb: Storyboard) => (sb.rasio === "16:9" ? { width: 1920, height: 1080 } : { width: 1080, height: 1920 });

export const RemotionRoot: React.FC = () => {
  return (
    <>
      {STORYBOARDS.map((sb) => (
        <React.Fragment key={sb.id}>
          <Composition
            id={sb.id}
            component={UDVideo}
            fps={FPS}
            {...dims(sb)}
            durationInFrames={totalFrames(sb)}
            defaultProps={{ storyboard: sb }}
          />
          <Folder name={`${sb.id}-Adegan`}>
            {sb.scenes.map((scene) => (
              <Composition
                key={scene.id}
                id={`${sb.id}-${scene.id}`}
                component={SceneView}
                fps={FPS}
                {...dims(sb)}
                durationInFrames={Math.round(scene.durasi * FPS)}
                defaultProps={{ scene }}
              />
            ))}
          </Folder>
        </React.Fragment>
      ))}
    </>
  );
};
