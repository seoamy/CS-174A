import { defs, tiny } from './examples/common.js';

const {
    Vector, Vector3, vec, vec3, vec4, color, hex_color, Matrix, Mat4, Light, Shape, Material, Scene,
} = tiny;

class Cube extends Shape {
    constructor() {
        super("position", "normal");
        // Loop 3 times (for each axis), and inside loop twice (for opposing cube sides):
        this.arrays.position = Vector3.cast(
            // for unit cube:
            // [-1, -1, -1], [1, -1, -1], [-1, -1, 1], [1, -1, 1], [1, 1, -1], [-1, 1, -1], [1, 1, 1], [-1, 1, 1],
            // [-1, -1, -1], [-1, -1, 1], [-1, 1, -1], [-1, 1, 1], [1, -1, 1], [1, -1, -1], [1, 1, 1], [1, 1, -1],
            // [-1, -1, 1], [1, -1, 1], [-1, 1, 1], [1, 1, 1], [1, -1, -1], [-1, -1, -1], [1, 1, -1], [-1, 1, -1]);

            // for 1.5 y height:
            [-1, -1, -1], [1, -1, -1], [-1, -1, 1], [1, -1, 1], [1, 2, -1], [-1, 2, -1], [1, 2, 1], [-1, 2, 1],
            [-1, -1, -1], [-1, -1, 1], [-1, 2, -1], [-1, 2, 1], [1, -1, 1], [1, -1, -1], [1, 2, 1], [1, 2, -1],
            [-1, -1, 1], [1, -1, 1], [-1, 2, 1], [1, 2, 1], [1, -1, -1], [-1, -1, -1], [1, 2, -1], [-1, 2, -1]);
        this.arrays.normal = Vector3.cast(
            [0, -1, 0], [0, -1, 0], [0, -1, 0], [0, -1, 0], [0, 2, 0], [0, 2, 0], [0, 2, 0], [0, 2, 0],
            [-1, 0, 0], [-1, 0, 0], [-1, 0, 0], [-1, 0, 0], [1, 0, 0], [1, 0, 0], [1, 0, 0], [1, 0, 0],
            [0, 0, 1], [0, 0, 1], [0, 0, 1], [0, 0, 1], [0, 0, -1], [0, 0, -1], [0, 0, -1], [0, 0, -1]);
        // Arrange the vertices into a square shape in texture space too:
        this.indices.push(0, 1, 2, 1, 3, 2, 4, 5, 6, 5, 7, 6, 8, 9, 10, 9, 11, 10, 12, 13,
            14, 13, 15, 14, 16, 17, 18, 17, 19, 18, 20, 21, 22, 21, 23, 22);
    }
}

class Cube_Outline extends Shape {
    constructor() {
        super("position", "color");
        this.arrays.position = Vector3.cast(
            // for unit cube: 
            // [-1, 1, -1], [1, 1, -1], [-1, 1, -1], [-1, -1, -1], [1, 1, -1], [1, -1, -1], [1, -1, -1], [-1, -1, -1],
            // [-1, -1, -1], [-1, -1, 1], [-1, -1, 1], [1, -1, 1], [1, -1, 1], [1, -1, -1], [1, -1, 1], [1, 1, 1],
            // [1, 1, -1], [1, 1, 1], [1, 1, 1], [-1, 1, 1], [-1, 1, 1], [-1, -1, 1], [-1, 1, 1], [-1, 1, -1]

            // for 1.5 y height:
            [-1, 2, -1], [1, 2, -1], [-1, 2, -1], [-1, -1, -1], [1, 2, -1], [1, -1, -1], [1, -1, -1], [-1, -1, -1],
            [-1, -1, -1], [-1, -1, 1], [-1, -1, 1], [1, -1, 1], [1, -1, 1], [1, -1, -1], [1, -1, 1], [1, 2, 1],
            [1, 2, -1], [1, 2, 1], [1, 2, 1], [-1, 2, 1], [-1, 2, 1], [-1, -1, 1], [-1, 2, 1], [-1, 2, -1]
        );

        this.arrays.color = [
            vec3(255, 255, 255), vec3(255, 255, 255), vec3(255, 255, 255), vec3(255, 255, 255), vec3(255, 255, 255), vec3(255, 255, 255), vec3(255, 255, 255), vec3(255, 255, 255),
            vec3(255, 255, 255), vec3(255, 255, 255), vec3(255, 255, 255), vec3(255, 255, 255), vec3(255, 255, 255), vec3(255, 255, 255), vec3(255, 255, 255), vec3(255, 255, 255),
            vec3(255, 255, 255), vec3(255, 255, 255), vec3(255, 255, 255), vec3(255, 255, 255), vec3(255, 255, 255), vec3(255, 255, 255), vec3(255, 255, 255), vec3(255, 255, 255),
            vec3(255, 255, 255), vec3(255, 255, 255), vec3(255, 255, 255), vec3(255, 255, 255), vec3(255, 255, 255), vec3(255, 255, 255), vec3(255, 255, 255), vec3(255, 255, 255),
        ]

        this.indices = false;
    }
}

class Cube_Single_Strip extends Shape {
    constructor() {
        super("position", "normal");

        this.arrays.position = Vector3.cast(
            // for unit cube:
            // 1, 1, 1], [-1, 1, 1], [1, 1, -1], [-1, 1, -1], [1, -1, 1], [-1, -1, 1], [-1, -1, -1], [1, -1, -1]

            // for 1.5 y height:
            [1, 2, 1], [-1, 2, 1], [1, 2, -1], [-1, 2, -1], [1, -1, 1], [-1, -1, 1], [-1, -1, -1], [1, -1, -1]
        );

        this.arrays.normal = Vector3.cast(
            [1, 2, 1], [-1, 2, 1], [1, 2, -1], [-1, 2, -1], [1, -1, 1], [-1, -1, 1], [-1, -1, -1], [1, -1, -1]
        );

        this.indices.push(3, 2, 6, 7, 4, 2, 0, 3, 1, 6, 5, 4, 1, 0)
    }
}


class Base_Scene extends Scene {
    /**
     *  **Base_scene** is a Scene that can be added to any display canvas.
     *  Setup the shapes, materials, camera, and lighting here.
     */
    constructor() {
        // constructor(): Scenes begin by populating initial values like the Shapes and Materials they'll need.
        super();
        this.hover = this.swarm = this.outline = false;
        // At the beginning of our program, load one of each of these shape definitions onto the GPU.
        this.shapes = {
            'cube': new Cube(),
            'outline': new Cube_Outline(),
            'triangle_strip': new Cube_Single_Strip()
        };
        // *** Materials
        this.materials = {
            plastic: new Material(new defs.Phong_Shader(),
                { ambient: .4, diffusivity: .6, color: hex_color("#ffffff") }),
        };
        // The white material and basic shader are used for drawing the outline.
        this.white = new Material(new defs.Basic_Shader());
    }

    display(context, program_state) {
        // display():  Called once per frame of animation. Here, the base class's display only does
        // some initial setup.

        // Setup -- This part sets up the scene's overall camera matrix, projection matrix, and lights:
        if (!context.scratchpad.controls) {
            this.children.push(context.scratchpad.controls = new defs.Movement_Controls());
            // Define the global camera and projection matrices, which are stored in program_state.
            program_state.set_camera(Mat4.translation(5, -10, -30));
        }
        program_state.projection_transform = Mat4.perspective(
            Math.PI / 4, context.width / context.height, 1, 100);

        // *** Lights: *** Values of vector or point lights.
        const light_position = vec4(0, 5, 5, 1);
        program_state.lights = [new Light(light_position, color(1, 1, 1, 1), 1000)];
    }
}

export class Assignment2 extends Base_Scene {
    /**
     * This Scene object can be added to any display canvas.
     * We isolate that code so it can be experimented with on its own.
     * This gives you a very small code sandbox for editing a simple scene, and for
     * experimenting with matrix transformations.
     */
    constructor() {
        super();
        this.colors = [];
        this.set_colors();
    }

    set_colors() {
        this.colors = []; // clear all existing colors, if any
        for (let i = 0; i < 8; i++) {
            let random_color = color(Math.random(), Math.random(), Math.random(), 1.0);
            while (this.colors.includes(random_color)) random_color = color(Math.random(), Math.random(), Math.random(), 1.0);
            this.colors.push(random_color);
        }
    }

    make_control_panel() {
        // Draw the scene's buttons, setup their actions and keyboard shortcuts, and monitor live measurements.
        this.key_triggered_button("Change Colors", ["c"], this.set_colors);
        // Add a button for controlling the scene.
        this.key_triggered_button("Outline", ["o"], () => {
            this.outline = !this.outline
        });
        this.key_triggered_button("Sit still", ["m"], () => {
            this.hover = !this.hover
        });
    }

    draw_box(context, program_state, model_transform, index) {
        let t = this.t = program_state.animation_time / 1000;

        if (this.hover) {
            t = 1 / 2;
        }

        if (this.outline) { // outline
            this.shapes.outline.draw(context, program_state, model_transform, this.white, "LINES");
        }
        else if (index % 2 == 0) { // even index = odd boxes = triangle strip
            this.shapes.triangle_strip.draw(context, program_state, model_transform, this.materials.plastic.override({ color: this.colors[index] }), "TRIANGLE_STRIP");
        }
        else { // regular box
            this.shapes.cube.draw(context, program_state, model_transform, this.materials.plastic.override({ color: this.colors[index] }));
        }

        // for unit cube: 
        // let Rx = Mat4.rotation((0.05 * Math.PI / 2) + (0.05 * Math.PI / 2) * Math.sin(Math.PI * t), 0, 0, 1);
        // model_transform = model_transform.times(Mat4.translation(0, 2, 0))

        let Rx = Mat4.rotation((0.05 * Math.PI / 2) + (0.05 * Math.PI / 2) * Math.sin(Math.PI * t), 0, 0, 2);
        model_transform = model_transform.times(Mat4.translation(0, 3, 0))
            .times(Mat4.translation(-1, -1, 0))
            .times(Rx)
            .times(Mat4.translation(1, 1, 0));

        return model_transform;
    }

    display(context, program_state) {
        super.display(context, program_state);
        let model_transform = Mat4.identity();

        for (let i = 0; i < 8; i++) {
            model_transform = this.draw_box(context, program_state, model_transform, i);
        }
    }
}