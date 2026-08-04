
module flame() { cube([1.5, 1.5, 1.5]); }
module top() { cube([2, 2, 2]); }
module stem(height) { cube([1, 1, height]); }
module branch(width) { cube([width, 1, 1]); }

module base() {
  cube([10, 10, 2]);
  translate([2, 2, 2]) cube([6, 6, 2]);
}

module temple_menorah() {
  color("gold") {
    base();

    translate([4.5, 4.5, 4]) stem(20);

    // top tier (center 3)
    translate([0.5, 4.5, 19]) branch(9);
    translate([0.5, 4.5, 19]) stem(5);
    translate([8.5, 4.5, 19]) stem(5);

    // mid tier (center 2 and 6)
    translate([-3.5, 4.5, 15]) branch(17);
    translate([-3.5, 4.5, 15]) stem(9);
    translate([12.5, 4.5, 15]) stem(9);

    // bottom tier (center 1 and 7)
    translate([-7.5, 4.5, 11]) branch(25);
    translate([-7.5, 4.5, 11]) stem(13);
    translate([16.5, 4.5, 11]) stem(13);

    translate([-8, 4, 24]) top();
    translate([-4, 4, 24]) top();
    translate([0, 4, 24]) top();
    translate([4, 4, 24]) top();
    translate([8, 4, 24]) top();
    translate([12, 4, 24]) top();
    translate([16, 4, 24]) top();
  }

  color("orange") {
    translate([-8 + 0.25, 4.5, 26]) flame();
    translate([-4 + 0.25, 4.5, 26]) flame();
    translate([0 + 0.25, 4.5, 26]) flame();
    translate([4 + 0.25, 4.5, 26]) flame();
    translate([8 + 0.25, 4.5, 26]) flame();
    translate([12 + 0.25, 4.5, 26]) flame();
    translate([16 + 0.25, 4.5, 26]) flame();
  }
}

//// uncomment below to convert it to the Minecraft coordinate system
// translate([-10, 0, 10])
//  rotate([-90, 0, 0])
temple_menorah();
