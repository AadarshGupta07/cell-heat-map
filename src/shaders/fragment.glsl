uniform vec3 color1;
  uniform vec3 color2;
  uniform vec3 color3;
  uniform vec2 clickPosition;

  varying vec2 vUv;

  void main() {
    vec2 center = clickPosition;
    float radius = length(vUv - center) * 2.0;

    vec3 color = vec3(0.0);
    if (radius <= 1.0) {
      if (radius <= 0.5) {
        color = mix(color1, color2, radius * 2.0);
      } else {
        color = mix(color2, color3, (radius - 0.5) * 2.0);
      }
    }

    gl_FragColor = vec4(color, 1.0);
  }