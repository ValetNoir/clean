function m4_mul_v(v, m) { return v_div_n([v[0] * m[0][0] + v[1] * m[1][0] + v[2] * m[2][0] + m[3][0], v[0] * m[0][1] + v[1] * m[1][1] + v[2] * m[2][1] + m[3][1], v[0] * m[0][2] + v[1] * m[1][2] + v[2] * m[2][2] + m[3][2]], v_dot(v, [m[0][3], m[1][3], m[2][3]]) + m[3][3]); }
function m4_mul_m4(m1, m2) {let m = m4_blank(); for(let i = 0; i < 4; i++) { for(let j = 0; j < 4; j++) { m[j][i] = m1[j][0] * m2[0][i] + m1[j][1] * m2[1][i] + m1[j][2] * m2[2][i] + m1[j][3] * m2[3][i]; } } return m; }
function m4_blank() { return [[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0]]; }
function m4_filled() { return [[1,1,1,1],[1,1,1,1],[1,1,1,1],[1,1,1,1]]; }
function m4_identity() { return [[1,0,0,0],[0,1,0,0],[0,0,1,0],[0,0,0,1]]; }
function m4_projection(w, h, fov, near, far) { let aspectRatio = h / w; let scale = 1 / Math.tan(fov* Math.PI / 360 ); return [[aspectRatio * scale, 0, 0, 0], [0, scale, 0, 0], [0, 0, far / (far - near), 1], [0, 0, -far * near / (far - near), 0]]; }
function m4_translation(vec) { return [[1,0,0,0],[0,1,0,0],[0,0,1,0],[vec[0],vec[1],vec[2],1]]; }
function m4_rotationX(theta) { let c = Math.cos(theta); let s = Math.sin(theta); return [[1,0,0,0],[0,c,s,0],[0,-s,c,0],[0,0,0,1]]; }
function m4_rotationY(theta) { let c = Math.cos(theta); let s = Math.sin(theta); return [[c,0,s,0],[0,1,0,0],[-s,0,c,0],[0,0,0,1]]; }
function m4_rotationZ(theta) { let c = Math.cos(theta); let s = Math.sin(theta); return [[c,s,0,0],[-s,c,0,0],[0,0,1,0],[0,0,0,1]]; }
function m4_pointAt(p, t, u) { let nf = v_nrml(v_sub_v(t, p)); let nu = v_nrml(v_sub_v(u, v_mul_n(nf, v_dot(u, nf)))); let nr = v_cross(nu, nf); return [[nr[0], nr[1], nr[2], 0], [nu[0], nu[1], nu[2], 0], [nf[0], nf[1], nf[2], 0], [p[0], p[1], p[2], 1]]; }
function m4_quickInverse(m) { return [[m[0][0],m[1][0],m[2][0],0],[m[0][1],m[1][1],m[2][1],0],[m[0][2],m[1][2],m[2][2],0],[-v_dot(m[0],m[3]),-v_dot(m[1],m[3]),-v_dot(m[2],m[3]),1]]; }

function m3_mul_v(v, m) { return [v[0] * m[0][0] + v[1] * m[1][0] + v[2] * m[2][0], v[0] * m[0][1] + v[1] * m[1][1] + v[2] * m[2][1], v[0] * m[0][2] + v[1] * m[1][2] + v[2] * m[2][2]]; }
function m3_rotation(vec) { let cx = Math.cos(vec[0]); let cy = Math.cos(vec[1]); let cz = Math.cos(vec[2]); let sx = Math.sin(vec[0]); let sy = Math.sin(vec[1]); let sz = Math.sin(vec[2]); return [[(cy * cz), sx * sy * cz - cx * sz, cx * sy * cz + sx * sz], [cy * sz, (sx * sy * sz + cx * cz), cx * sy * sz - sx * cz], [-sy, sx * cy, (cx * cy)]]; };

function t_blank() { return [[0,0,0],[0,0,0],[0,0,0]]; }
function t_sort(t) { return t.sort((a, b) => a[1] - b[1]); }
function t_nrml(t) { return v_nrml(v_cross(v_sub_v(t[1], t[0]), v_sub_v(t[2], t[0]))); }
function t_avg(t) { return [ (t[0][0] + t[1][0] + t[2][0]) / 3, (t[0][1] + t[1][1] + t[2][1]) / 3, (t[0][2] + t[1][2] + t[2][2]) / 3 ]}
// function t_clip(p_p, p_n, t) {
//   p_n = v_nrml(p_n);
//   let subber = v_dot(p_n, p_p);
//   let i_p = [];
//   let o_p = [];
//   let i_t = [];
//   let o_t = [];

//   // Get signed distance of each point in triangle to plane
//   let d0 = v_dot(p_n, t[0]) - subber;
//   let d1 = v_dot(p_n, t[1]) - subber;
//   let d2 = v_dot(p_n, t[2]) - subber;

//   if (d0 >= 0) { i_p.push(t[0]); } else { o_p.push(t[0]); }
//   if (d1 >= 0) { i_p.push(t[1]); } else { o_p.push(t[1]); }
//   if (d2 >= 0) { i_p.push(t[2]); } else { o_p.push(t[2]); }

//   if (i_p.length == 0) { return []; }
//   if (i_p.length == 3) { return [t]; }
//   if (i_p.length == 1 && o_p.length == 2) { return [[i_p[0], v_intersect(p_p, p_n, i_p[0], o_p[0]), v_intersect(p_p, p_n, i_p[0], o_p[1])]]; }
//   if (i_p.length == 2 && o_p.length == 1) { let ot2 = v_intersect(p_p, p_n, i_p[0], o_p[0]); return [[i_p[0], i_p[1], ot2], [i_p[1], ot2, v_intersect(p_p, p_n, i_p[1], o_p[0])]]; }
// }

function v_blank() { return [0,0,0,1]; }
function v_add_v(v1, v2) { return [v1[0] + v2[0], v1[1] + v2[1], v1[2] + v2[2]]; }
function v_sub_v(v1, v2) { return [v1[0] - v2[0], v1[1] - v2[1], v1[2] - v2[2]]; }
function v_mul_v(v1, v2) { return [v1[0] * v2[0], v1[1] * v2[1], v1[2] * v2[2]]; }
function v_div_v(v1, v2) { return [v1[0] / v2[0], v1[1] / v2[1], v1[2] / v2[2]]; }
function v_add_n(v, k) { return [v[0] + k, v[1] + k, v[2] + k]; }
function v_sub_n(v, k) { return [v[0] - k, v[1] - k, v[2] - k]; }
function v_mul_n(v, k) { return [v[0] * k, v[1] * k, v[2] * k]; }
function v_div_n(v, k) { return (k == 0)? v : [v[0] / k, v[1] / k, v[2] / k]; }
function v_dot(v1, v2) { return v1[0] * v2[0] + v1[1] * v2[1] + v1[2] *  v2[2]; }
function v_len(v) { return Math.sqrt(v_dot(v, v)); }
function v_nrml(v) { return v_div_n(v, v_len(v)); }
function v_cross(v1, v2) { return [v1[1] * v2[2] - v1[2] * v2[1], v1[2] * v2[0] - v1[0] * v2[2], v1[0] * v2[1] - v1[1] * v2[0]]; }
function v_ceil(vec) { return [ Math.ceil(vec[0]), Math.ceil(vec[1]), Math.ceil(vec[2])]; }
function v_floor(vec) { return [ Math.floor(vec[0]), Math.floor(vec[1]), Math.floor(vec[2])]; }
function v_round(vec) { return [ Math.round(vec[0]), Math.round(vec[1]), Math.round(vec[2])]; }
function v_intersect(plane_p, plane_n, lineStart, lineEnd) { plane_n = v_nrml(plane_n); let ad = v_dot(lineStart, plane_n); let t = (v_dot(plane_n, plane_p) - ad) / (v_dot(lineEnd, plane_n) - ad); return [v_add_v(lineStart, v_mul_n(v_sub_v(lineEnd, lineStart), t)), t]; }

function sleep(ms) { return new Promise(resolve => setTimeout(resolve, ms)); }
function average(array) { let total = 0; array.forEach(n => total += n); return total / array.length; }