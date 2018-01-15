from util import entropy, information_gain, partition_classes
import numpy as np
from collections import Counter
import ast

class DecisionTree(object):
    def __init__(self):
        # Initializing the tree as an empty dictionary or list, as preferred
        #self.tree = []
        self.tree = {}
        pass

    def learn(self, X, y):
        # TODO: Train the decision tree (self.tree) using the the sample X and labels y
        # You will have to make use of the functions in utils.py to train the tree
        
        # One possible way of implementing the tree:
        #    Each node in self.tree could be in the form of a dictionary:
        #       https://docs.python.org/2/library/stdtypes.html#mapping-types-dict
        #    For example, a non-leaf node with two children can have a 'left' key and  a 
        #    'right' key. You can add more keys which might help in classification
        #    (eg. split attribute and split value)

        if len(set(y)) == 1:
            self.tree['label'] = y[0]
            return

        if len(set(y)) == 0:
            self.tree['label'] = 0
            return

        # store the maximum information gain and related attribute and value
        maxIG = -1
        split_attribute = -1
        split_val = None
        x_left = []
        y_left = []
        x_right = []
        y_right = []

        # find the maximum information gain
        for i in range(len(X)):
            for j in range(len(X[0])):
                cur = X[i][j]
                x1, x2, y1, y2 = partition_classes(X, y, j, cur)
                curY = [y1, y2]
                IG = information_gain(y, curY)
                if IG > maxIG:
                    maxIG = IG
                    split_attribute = j
                    split_val = cur
                    x_left = x1
                    y_left = y1
                    x_right = x2
                    y_right = y2

        self.tree['left'] = DecisionTree()
        self.tree['right'] = DecisionTree()
        self.tree['left'].learn(x_left, y_left)
        self.tree['right'].learn(x_right, y_right)
        self.tree['attribute'] = split_attribute
        self.tree['value'] = split_val
        pass

    def classify(self, record):
        # TODO: classify the record using self.tree and return the predicted label
        root = self.tree

        while 'value' in root:
            split_attribute = root['attribute']
            split_val = root['value']

            if isinstance(record[split_attribute], int):
                if record[split_attribute] <= split_val:
                    root = root['left'].tree
                else:
                    root = root['right'].tree
            else:
                if record[split_attribute] == split_val:
                    root = root['left'].tree
                else:
                    root = root['right'].tree

        return root['label']
        pass