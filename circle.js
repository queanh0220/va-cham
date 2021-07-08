class Circle extends GameObject
{
    // Define the number of columns and rows in the sprite
    static numColumns = 5;
    static numRows = 2;
    static frameWidth = 0;
    static frameHeight = 0;


    constructor (context, x, y, vx, vy, mass, radius)
    {
        // Pass params to super class
        super(context, x, y, vx, vy);
        // Set the size of the hitbox
        this.radius = radius;
        this.mass = mass;
        this.type = true;
        this.sprite;
        // Supply the sprite. Only load it once and reuse it
        this.loadImage();
    }

    loadImage()
    {
        if (!this.sprite)
        {
            this.sprite = new Image();
            // No image found, create a new element
            // Handle a successful load
            this.sprite.onload = () =>
            {
                // Define the size of a frame
                Circle.frameWidth = this.sprite.width ;
                Circle.frameHeight = this.sprite.height ;
            };

            // Start loading the image
            this.sprite.src = 'path31.png';
        }
        // Check for an existing image
        
    }

    draw()
    {
        // Limit the maximum frame
        //let maxFrame = Circle.numColumns * Circle.numRows - 1;
        ///if (this.currentFrame > maxFrame){
         //   this.currentFrame = maxFrame;
        //}

        // Update rows and columns
        //let column = this.currentFrame % Circle.numColumns;
       // let row = Math.floor(this.currentFrame / Circle.numColumns);
        this.context.translate(this.x, this.y);
        this.context.rotate(Math.PI / 180 * (this.angle + 90));
        this.context.translate(-this.x, -this.y);
        // Draw the image

        this.context.drawImage(this.sprite, (this.x - this.radius), (this.y - this.radius) - this.radius * 0.5, this.radius * 2.22, this.radius * 2.5)
        //this.context.beginPath();
        //this.context.arc(this.x,this.y,this.radius, 0, Math.PI*2);
        //this.context.stroke();

        this.context.setTransform(1, 0, 0, 1, 0, 0);
    }

    handleCollision()
    {
        // Pick the next frame of the animation
        //this.currentFrame++;
        this.type = !this.type;
        if(this.type)this.sprite.src = "path31.png";
        else this.sprite.src = "path32.png";
    }

    update(secondsPassed)
    {
        // Move with velocity x/y
        this.x += this.vx * secondsPassed;
        this.y += this.vy * secondsPassed;
        let radians = Math.atan2(this.vy, this.vx);
        this.angle = 180 * radians / Math.PI;
    }
}