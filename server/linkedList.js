// Note: comments done with
// http://patorjk.com/software/taag/#p=display&f=Doom&t=Logger

//  _     _       _            _ _     _     _   
// | |   (_)     | |          | | |   (_)   | |  
// | |    _ _ __ | | _____  __| | |    _ ___| |_ 
// | |   | | '_ \| |/ / _ \/ _` | |   | / __| __|
// | |___| | | | |   <  __/ (_| | |___| \__ \ |_ 
// \_____/_|_| |_|_|\_\___|\__,_\_____/_|___/\__|

/*
var w = {avatarID: 2};
var x = {avatarID: 3};
var y = {avatarID: 4};
var z = {avatarID: 5};
*/

// Linked list implementation
var LinkedList = function () {
  // Front of list
  this.head = null;
  // Back of list
  this.tail = null;
  // List of nodes where key is avatar id,
  // value is avatar data
  this.nodes = {};
};

// Node constructer
var NodeMaker = function (val, prev, next) {
  // Value
  this.val = (val !== undefined ? val : null);
  // Prev
  this.prev = prev || null;
  // Next
  this.next = next || null;
};

// Print method to print contents of list
LinkedList.prototype.print = function () {
  // String representation
  var str = '[';
  // Get current node
  var currNode = this.head;
  // Loop until current node is null
  while (currNode) {
    // Add the current node's value
    str += currNode.val.avatarID;
    // Update the current node to be the next
    currNode = currNode.next;
    // If the node isn't the tail, add a arrow
    if (currNode !== null) {
      str += ' -> ';
    }
  }
  str += ']';
  console.log(str);
};

// Check if node exists in queue already
LinkedList.prototype.contains = function (avatarID) {
  return avatarID in this.nodes;
};

// Linked list add to front
LinkedList.prototype.addToFront = function (val) {
  // Only continue if avatar isn't in queue
  if (!this.contains(val.avatarID)) {
    // Get pointer to current head
    var currHead = this.head;
    // Make new node
    var newHead = new NodeMaker(val, null, currHead);
    // Set current head's prev to newHead
    if (currHead) {
      currHead.prev = newHead;
    }
    // Set head of this list
    this.head = newHead;
    // If there is no tail, set this to be the tail
    if (!this.tail) {
      this.tail = newHead;
    }
    // Add newHead to nodes
    this.nodes[newHead.val.avatarID] = newHead;
  }
};

// Linked list add to back
LinkedList.prototype.addToBack = function (val) {
  // Only continue if avatar isn't in queue
  if (!this.contains(val.avatarID)) {
    // Get pointer to current tail
    var currTail = this.tail;
    // Make new node
    var newTail = new NodeMaker(val, currTail, null);
    // Set current tail's next to newTail
    if (currTail) {
      currTail.next = newTail;
    }
    // If there is no head, set this to be the head
    if (!this.head) {
      this.head = newTail;
    }
    // Set tail of list
    this.tail = newTail;

    // Add newTail to nodes
    this.nodes[newTail.val.avatarID] = newTail;
  }
};

// Linked list remove node
LinkedList.prototype.removeByAvatarID = function (avatarID) {
  // Only continue if avatar id is in queue
  if (this.contains(avatarID)) {
    // Get the associated node
    var nodeToRemove = this.nodes[avatarID];
    // Get the associated node's prev and next
    var nodeToRemove_Prev = nodeToRemove.prev;
    var nodeToRemove_Next = nodeToRemove.next;

    // Point Prev to Next
    if (nodeToRemove_Prev) {
      nodeToRemove_Prev.next = nodeToRemove_Next;
    }
    // Point Next to Prev
    if (nodeToRemove_Next) {
      nodeToRemove_Next.prev = nodeToRemove_Prev;
    }

    // Set new head and tail if necessary
    if (nodeToRemove === this.head) {
      console.log('editing head');
      this.head = nodeToRemove_Next;
    }
    if (nodeToRemove === this.tail) {
      console.log('editing tail');
      this.tail = nodeToRemove_Prev;
    }

    // Delete key for avatarID
    delete this.nodes[avatarID];
  } else {
    // Log avatar removal attempt for avatar not in line
    console.log('Avatar removal error')
  }
};

//                             _       
//                            | |      
//   _____  ___ __   ___  _ __| |_ ___ 
//  / _ \ \/ / '_ \ / _ \| '__| __/ __|
// |  __/>  <| |_) | (_) | |  | |_\__ \
//  \___/_/\_\ .__/ \___/|_|   \__|___/
//           | |                       
//           |_|    

// Export linked list
module.exports = LinkedList;