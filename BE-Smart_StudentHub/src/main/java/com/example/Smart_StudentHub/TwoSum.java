package com.example.Smart_StudentHub;

import java.util.*;

class Solution {
    public List<int[]> twoSumAll(int[] nums, int target) {
        List<int[]> result = new ArrayList<>();
        for(int i = 0; i < nums.length; i++){
           for(int j = i + 1; j < nums.length; j++){
               if (nums[i] + nums[j] == target) {
                   result.add(new int[]{i, j});
               }
           }
        }

    return result;

    }

    public static void main(String[] args) {
        Solution solution = new Solution();
        List<int[]> result = solution.twoSumAll(new int[]{2, 7, 11, 15, 2, 8, 1, 5, 8, 7, 4}, 9);

        for (int[] pair : result) {
            System.out.println(Arrays.toString(pair));
        }
    }
}

