import { Config } from "@remotion/cli/config";

// WebGL dans Chrome sans écran : ANGLE est le moteur le plus fiable sous Windows.
Config.setChromiumOpenGlRenderer("angle");
Config.setVideoImageFormat("jpeg");
Config.setJpegQuality(92);
Config.setConcurrency(2);
