import { defs, tiny } from './examples/common.js';

const {
    Vector, Vector3, vec, vec3, vec4, color, hex_color, Shader, Matrix, Mat4, Light, Shape, Material, Scene, Texture,
} = tiny;

const { Cube, Axis_Arrows, Textured_Phong } = defs

export class Assignment4 extends Scene {
    /**
     *  **Base_scene** is a Scene that can be added to any display canvas.
     *  Setup the shapes, materials, camera, and lighting here.
     */
    constructor() {
        // constructor(): Scenes begin by populating initial values like the Shapes and Materials they'll need.
        super();

        // TODO:  Create two cubes, including one with the default texture coordinates (from 0 to 1), and one with the modified
        //        texture coordinates as required for cube #2.  You can either do this by modifying the cube code or by modifying
        //        a cube instance's texture_coords after it is already created.
        this.shapes = {
            box_1: new Cube(),
            box_2: new Cube(),
            axis: new Axis_Arrows()
        }

        // TODO:  Create the materials required to texture both cubes with the correct images and settings.
        //        Make each Material from the correct shader.  Phong_Shader will work initially, but when
        //        you get to requirements 6 and 7 you will need different ones.
        this.materials = {
            phong: new Material(new Textured_Phong(), {
                color: hex_color("#ffffff"),
            }),
            star_texture: new Material(new Texture_Rotate(), {
                color: hex_color("#000000"),
                ambient: 1, diffusivity: 0.1, specularity: 0.1,
                texture: new Texture("assets/stars.png", "NEAREST")
            }),
            earth_texture: new Material(new Texture_Scroll_X(), {
                color: hex_color("#000000"),
                ambient: 1, diffusivity: 0.1, specularity: 0.1,
                texture: new Texture("assets/earth.gif", "LINEAR_MIPMAP_LINEAR")
            }),
        }

        // this.initial_camera_location = Mat4.look_at(vec3(0, 10, 20), vec3(0, 0, 0), vec3(0, 1, 0));
        this.initial_camera_location = Mat4.look_at(vec3(0, 0, 8), vec3(0, 0, 0), vec3(0, 1, 0));
        this.rotate = false;
        this.star_box_rot_angle = 0;
        this.earth_box_rot_angle = 0;
    }

    make_control_panel() {
        // TODO:  Implement requirement #5 using a key_triggered_button that responds to the 'c' key.
        this.key_triggered_button("Cube rotation", ["c"], () => this.rotate = !this.rotate);
    }

    display(context, program_state) {
        if (!context.scratchpad.controls) {
            this.children.push(context.scratchpad.controls = new defs.Movement_Controls());
            // Define the global camera and projection matrices, which are stored in program_state.
            program_state.set_camera(Mat4.translation(0, 0, -8));
        }

        program_state.projection_transform = Mat4.perspective(
            Math.PI / 4, context.width / context.height, 1, 100);

        const light_position = vec4(10, 10, 10, 1);
        program_state.lights = [new Light(light_position, color(1, 1, 1, 1), 1000)];

        let t = program_state.animation_time / 1000, dt = program_state.animation_delta_time / 1000;
        // let model_transform = Mat4.identity();
        let cube1_transform = Mat4.identity().times(Mat4.translation(-2, 0, 0));
        let cube2_transform = Mat4.identity().times(Mat4.translation(2, 0, 0));

        if (this.rotate) {
            this.star_box_rot_angle += dt * Math.PI * 2 / 3;
            this.earth_box_rot_angle += dt * Math.PI;
        }

        this.shapes.box_2.arrays.texture_coord.forEach(
            (v, i, l) => v[0] = v[0] + 0.25
        )

        // TODO:  Draw the required boxes. Also update their stored matrices.
        this.shapes.box_1.draw(context, program_state, cube1_transform.times(Mat4.rotation(this.star_box_rot_angle, 1, 0, 0)), this.materials.star_texture);
        this.shapes.box_2.draw(context, program_state, cube2_transform.times(Mat4.rotation(this.earth_box_rot_angle, 0, 1, 0)), this.materials.earth_texture);
    }
}


class Texture_Scroll_X extends Textured_Phong {
    // TODO:  Modify the shader below (right now it's just the same fragment shader as Textured_Phong) for requirement #6.
    fragment_glsl_code() {
        return this.shared_glsl_code() + `
            varying vec2 f_tex_coord;
            uniform sampler2D texture;
            uniform float animation_time;
            
            void main(){
                mat4 tx = mat4(vec4(-1., 0., 0., 0.), vec4(0., 1., 0., 0.), vec4(0., 0., 0., 0.), vec4(mod(2.0 * animation_time, 60.0) , 0., 0., 0.)); 
                vec4 scroll_vec = vec4(f_tex_coord, 0., 0.);
                scroll_vec =  tx * (scroll_vec + vec4(1., 1., 0., 1.)); 
                vec2 scaled_scroll_vec = vec2(scroll_vec.x * 2., scroll_vec.y * 2.);
                vec4 tex_color = texture2D(texture, scaled_scroll_vec);

                float x = mod(scaled_scroll_vec.x, 1.0);
                float y = mod(scaled_scroll_vec.y, 1.0);
                if (((x >= 0.15 && x <= 0.25) && (y >= 0.15 && y <= 0.85)) || // left edge
                    ((x >= 0.15 && x <= 0.85) && (y >= 0.15 && y <= 0.25)) || // bottom edge
                    ((x >= 0.15 && x <= 0.85) && (y >= 0.75 && y <= 0.85)) || // top edge
                    ((x >= 0.75 && x <= 0.85) && (y >= 0.15 && y <= 0.85)))  {
                    tex_color = vec4(0, 0, 0, 1.0);
                }

                // Sample the texture image in the correct place:
                if( tex_color.w < .01 ) discard;
                                                                         // Compute an initial (ambient) color:
                gl_FragColor = vec4( ( tex_color.xyz + shape_color.xyz ) * ambient, shape_color.w * tex_color.w ); 
                                                                         // Compute the final color with contributions from lights:
                gl_FragColor.xyz += phong_model_lights( normalize( N ), vertex_worldspace );
        } `;
    }
}


class Texture_Rotate extends Textured_Phong {
    // TODO:  Modify the shader below (right now it's just the same fragment shader as Textured_Phong) for requirement #7.
    fragment_glsl_code() {
        return this.shared_glsl_code() + `
            varying vec2 f_tex_coord;
            uniform sampler2D texture;
            uniform float animation_time;
            void main(){
                // calculate rotate matrix  
                vec2 new_tex = f_tex_coord + vec2(-0.5, -0.5);
                float angle = 0.5 * -3.14159 * mod(animation_time, 4.0);
                mat2 rot = mat2(cos(angle), sin(angle), -sin(angle), cos(angle));
                new_tex = rot * new_tex + vec2(0.5, 0.5);
                vec4 tex_color = texture2D(texture, new_tex); 

                // black out square
                float x = mod(new_tex.x, 1.0);
                float y = mod(new_tex.y, 1.0);
                if (((x >= 0.15 && x <= 0.25) && (y >= 0.15 && y <= 0.85)) || // left edge
                    ((x >= 0.15 && x <= 0.85) && (y >= 0.15 && y <= 0.25)) || // bottom edge
                    ((x >= 0.15 && x <= 0.85) && (y >= 0.75 && y <= 0.85)) || // top edge
                    ((x >= 0.75 && x <= 0.85) && (y >= 0.15 && y <= 0.85))) {
                    tex_color = vec4(0, 0, 0, 1.0);
                }

                // Sample the texture image in the correct place:
                if( tex_color.w < .01 ) discard;
                                                                         // Compute an initial (ambient) color:
                gl_FragColor = vec4( ( tex_color.xyz + shape_color.xyz ) * ambient, shape_color.w * tex_color.w ); 
                                                                         // Compute the final color with contributions from lights:
                gl_FragColor.xyz += phong_model_lights( normalize( N ), vertex_worldspace );
        } `;
    }
}

