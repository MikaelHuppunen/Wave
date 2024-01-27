# Wave

A stick figure doing different kinds of waves  

## Methods  

The wave applies a force to the arms that is proportional to the difference between the height of the wave at a given x position and the arm position at that same x position. 
That force causes a torque relative to the joints, which is then numerically integrated along each arm section. The joint is then rotated proportional to that force. 
That force is divided by the mass of the arm sections. This causes the smaller arm sections to be more stable compared to the real world case, where the force would be divided by the moment of inertia, 
which depends on the length of the arm section. The angular momentum of the arm sections is not conserved. This prevents the arms from overswinging. 
The torque is calculated multiple times per animation step, which leads to more accurate adjustments.
