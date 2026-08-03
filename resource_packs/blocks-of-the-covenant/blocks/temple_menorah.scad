
module flame() { cube([0.75, 0.75, 0.75]); }
module top() { cube(); }
module stem(height) { cube([0.5, 0.5, height]); }
module branch(width) { cube([width, 0.5, 0.5]); }

module base() {
  cube([5,5,1]);
  translate([1,1,1]) cube([3,3,1]);
}

module temple_menorah() {
  color("gold") {
    base();

    translate([2.25,2.25, 2]) stem(10);

    // top tier (center 3)
    translate([0.25, 2.25, 9.5]) branch(4.5);
    translate([0.25,2.25,9.5]) stem(2.5);
    translate([4.25,2.25,9.5]) stem(2.5);

    // mid tier (center 2 and 6)
    translate([-1.75, 2.25, 7.5]) branch(8.5);
    translate([-1.75,2.25,7.5]) stem(4.5);
    translate([6.25,2.25,7.5]) stem(4.5);

    // bottom tier (center 1 and 7)
    translate([-3.75, 2.25, 5.5]) branch(12.5);
    translate([-3.75,2.25,5.5]) stem(6.5);
    translate([8.25,2.25,5.5]) stem(6.5);

    translate([-4, 2, 12]) top();
    translate([-2, 2, 12]) top();
    translate([0, 2, 12]) top();
    translate([2, 2, 12]) top();
    translate([4, 2, 12]) top();
    translate([6, 2, 12]) top();
    translate([8, 2, 12]) top();
  }

  color("orange") {
    translate([-4 + 0.125, 2 + 0.125, 13]) flame();
    translate([-2 + 0.125, 2 + 0.125, 13]) flame();
    translate([0 + 0.125, 2 + 0.125, 13]) flame();
    translate([2 + 0.125, 2 + 0.125, 13]) flame();
    translate([4 + 0.125, 2 + 0.125, 13]) flame();
    translate([6 + 0.125, 2 + 0.125, 13]) flame();
    translate([8 + 0.125, 2 + 0.125, 13]) flame();
  }
}

translate([-2.5,0,2.5])
  rotate([-90, 0, 0])
    temple_menorah();
