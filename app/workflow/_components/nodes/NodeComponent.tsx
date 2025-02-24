import { NodeProps } from "@xyflow/react";
import { memo } from "react";
import NodeCard from "@/app/workflow/_components/nodes/NodeCard";

const NodeComponent = memo((props: NodeProps) => {
    return (
        <NodeCard nodeId={props.id}> AppNode </NodeCard>
    );
});

NodeComponent.displayName = "NodeComponent";

export default NodeComponent;
