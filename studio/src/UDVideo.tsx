import React, { useMemo } from "react";
import { AbsoluteFill, Audio, Sequence, staticFile, useCurrentFrame, useVideoConfig } from "remotion";
import { TransitionSeries, linearTiming } from "@remotion/transitions";
import { Background } from "./components/Background";
import { CaptionBar } from "./components/CaptionBar";
import { DeltaLogo } from "./components/DeltaLogo";
import { TumpalFrame } from "./components/TumpalFrame";
import { presentationFor } from "./components/transitions";
import { CounterScene } from "./scenes/CounterScene";
import { DiagramScene } from "./scenes/DiagramScene";
import { EquationScene } from "./scenes/EquationScene";
import { GraphScene } from "./scenes/GraphScene";
import { OutroScene } from "./scenes/OutroScene";
import { ProjectileScene } from "./scenes/ProjectileScene";
import { TitleScene } from "./scenes/TitleScene";
import { SourcesScene } from "./scenes/SourcesScene";
import { IllustrationScene } from "./scenes/IllustrationScene";
import { LambangScene } from "./scenes/LambangScene";
import { GoldDust } from "./scenes/common";
import { FPS, TRANS_FRAMES, VO_LEAD, buildCaptions, sceneTimings } from "./storyboard/timeline";
import type { Scene, Storyboard } from "./storyboard/types";
import { applyTheme } from "./brand/tema";

const SceneBody: React.FC<{ scene: Scene }> = ({ scene }) => {
  switch (scene.type) {
    case "title":
      return <TitleScene {...scene.props} />;
    case "diagram":
      return <DiagramScene {...scene.props} />;
    case "equation":
      return <EquationScene {...scene.props} durasi={scene.durasi} />;
    case "graph":
      return <GraphScene {...scene.props} />;
    case "projectile":
      return <ProjectileScene {...scene.props} />;
    case "counter":
      return <CounterScene {...scene.props} />;
    case "outro":
      return <OutroScene {...scene.props} />;
    case "sumber":
      return <SourcesScene {...scene.props} />;
    case "ilustrasi":
      return <IllustrationScene {...scene.props} />;
    case "lambang":
      return <LambangScene {...scene.props} />;
    default:
      return null;
  }
};

export const SceneView: React.FC<{ scene: Scene; pilar?: Storyboard["pilar"] }> = ({ scene, pilar }) => {
  if (pilar) applyTheme(pilar);
  return (
  <AbsoluteFill>
    <Background variant={scene.bg ?? "navy"} />
    {scene.bingkai ? <TumpalFrame color={scene.bg === "perkamen" ? "#6B5A44" : undefined} /> : null}
    <GoldDust />
    {scene.ilustrasi && scene.type !== "ilustrasi" ? <IllustrationScene {...scene.ilustrasi} judul={undefined} /> : null}
    <SceneBody scene={scene} />
  </AbsoluteFill>
  );
};

const Watermark: React.FC<{ hideFrom: number }> = ({ hideFrom }) => {
  const frame = useCurrentFrame();
  const { width } = useVideoConfig();
  if (frame >= hideFrom) return null;
  const s = width / 1080;
  return (
    <div style={{ position: "absolute", top: 70 * s, right: 70 * s, opacity: 0.32 }}>
      <DeltaLogo size={64 * s} isStatic id="wm" />
    </div>
  );
};

/** Video UDcation lengkap dari satu storyboard JSON. */
export const UDVideo: React.FC<{ storyboard: Storyboard }> = ({ storyboard }) => {
  applyTheme(storyboard.pilar);
  const timings = useMemo(() => sceneTimings(storyboard), [storyboard]);
  const captions = useMemo(() => buildCaptions(storyboard), [storyboard]);
  // watermark disembunyikan mulai adegan outro (logo besar sudah tampil)
  const outroIdx = storyboard.scenes.findIndex((sc) => sc.type === "outro");
  const last = timings[outroIdx >= 0 ? outroIdx : timings.length - 1];
  return (
    <AbsoluteFill style={{ backgroundColor: "#141833" }}>
      <TransitionSeries>
        {storyboard.scenes.flatMap((scene, i) => {
          const els = [
            <TransitionSeries.Sequence key={`s-${scene.id}`} name={scene.id} durationInFrames={Math.round(scene.durasi * FPS)}>
              <SceneView scene={scene} pilar={storyboard.pilar} />
            </TransitionSeries.Sequence>,
          ];
          const t = scene.transisi ?? "iris";
          if (i < storyboard.scenes.length - 1 && t !== "none") {
            els.push(
              <TransitionSeries.Transition
                key={`t-${scene.id}`}
                presentation={presentationFor(t)}
                timing={linearTiming({ durationInFrames: TRANS_FRAMES[t] })}
              />,
            );
          }
          return els;
        })}
      </TransitionSeries>
      <Watermark hideFrom={last ? last.start : Infinity} />
      <CaptionBar chunks={captions} />
      {storyboard.audio?.voiceover ? <Audio src={staticFile(storyboard.audio.voiceover)} /> : null}
      {storyboard.scenes.map((scene, i) =>
        scene.vo ? (
          <Sequence key={`vo-${scene.id}`} name={`VO ${scene.id}`} from={timings[i].start + VO_LEAD} durationInFrames={Math.ceil(scene.vo.durasi * FPS) + 2}>
            <Audio src={staticFile(scene.vo.file)} />
          </Sequence>
        ) : null,
      )}
      {storyboard.audio?.musik ? (
        <Sequence>
          <Audio src={staticFile(storyboard.audio.musik)} volume={storyboard.audio.musikVolume ?? 0.18} loop />
        </Sequence>
      ) : null}
    </AbsoluteFill>
  );
};
