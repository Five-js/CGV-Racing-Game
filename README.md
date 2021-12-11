# FiveJS-Racing-Game.

This is a racing game where the user selects a track, a car and races
against the clock. The point of the game is to complete the levels before the time runs out and to do
this players are given a specific amount of time to finish all 3 laps of each level. If the user does not
complete all 3 laps of the level they are on, they will lose.
The first design decision we agreed on is to use a subroutine hierarchy instead of a scene graph. This
decision was based on our desire to use classes to represent our objects as it is the framework that
many of our group members are comfortable with rather than using a data structure. Objects are
built from their basic components and combined to make more complex structures to populate the
scene.

The second design decision was regarding the cameras. We decided on implementing 2 cameras,
the first camera is a third person camera - this camera was chosen so that when the user plays the
game it can follow the car and they can keep track of where they are in the world and where they
are going and turning. The second camera is a world camera that moves around in the scene and
does not focus on a specific object, this camera was chosen because it is able to move around the
scene displaying how it looks and this is done for demonstration purposes for the current levels
without moving any objects within the scene.

The next decision was based on the lighting to be implemented. We used a directional light and the
conclusion on using this type of light was brought about through experimentation with different
lighting such as the point light. Directional light presented a better visual effect thus it being the first
choice. The other lightings we chose along with the directional light was the ambient lighting to
implement a more vibrant visual aspect to the scene and prevent it from looking darker than it
originally was, Diffuse and Emission lighting so that the objects in the scene are visible and are not
dim or dull. Finally, we implemented textures for visual appeal, specifically we used image textures
as they gave the scene a more realistic appearance than when we used artificial textures, and they
were simpler to work with. We also implemented antialiasing to make the objects look better and
smoother when viewing them in 3D and so the lines do not look jaggered when rendering.

We went with the WASD standard for the controls as it is the general control standard that most racing games use. The other
option of using the mouse to move the cars was rejected as we felt it was uncomfortable to use it
and we wanted to use the mouse to control the world camera as that would be the most
convenient for our game specifically.

The final decision has to do with the game mechanics/logic, and we decided to implement our own
mechanics/logic instead of importing a physics library - this was because we did not require heavyduty physics handling for the game, and we wanted to add a quirky feel to the game rather than a
serious and conventional experience to make it more fun for the users. Importing a physics library
would also impose some restrictions for the game which we did not require and the library was over
defined for the simple logic we wanted to implement. We only required certain logic to keep the
user on the track and we were able to implement it as well as transporting them back on the track
when they are out of bounds. There was nothing to collide with on the track, so using a physics
library was excessive.

Overall the game has the ‘not too serious’ feel we were looking for and our design decisions helped
us overcome obstacles that we would have otherwise found difficult to tackle. Another point to
note is also that due to the shear number of objects to be rendered in the game, if you are running
on limited GPU power, the first few frames of rendering might cause a lag but then will smooth out
as you play the game further, a risk we thought was worth it for visual appeal.

link to demo video: https://drive.google.com/file/d/1fHxcf1EQrRI-rd9dFjPT_0rl_h6oafBc/view?usp=sharing
